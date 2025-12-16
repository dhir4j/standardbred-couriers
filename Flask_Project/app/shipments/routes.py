
from flask import Blueprint, request, jsonify
from app.models import Shipment, User, PaymentRequest, BalanceCode, SavedAddress
from app.extensions import db
from app.schemas import ShipmentCreateSchema, PaymentSubmitSchema, SavedAddressSchema
from app.utils import generate_shipment_id_str
from datetime import datetime
from sqlalchemy import func, exc
from decimal import Decimal

shipments_bp = Blueprint("shipments", __name__, url_prefix="/api")

def _create_shipment_record(user, shipment_data, final_total_price):
    price_without_tax = round(Decimal(str(final_total_price)) / Decimal('1.18'), 2)
    tax_amount = Decimal(str(final_total_price)) - price_without_tax
    
    status = "Pending Payment"
    tracking_activity = "Shipment created. Awaiting payment confirmation."

    if user.is_employee:
        final_price_decimal = Decimal(str(final_total_price))
        if user.balance >= final_price_decimal:
            user.balance -= final_price_decimal
            status = "Booked"
            tracking_activity = "Shipment booked and paid with employee balance."
        else:
            return {"error": "Insufficient balance to book shipment."}, 402

    now_iso = datetime.utcnow().isoformat()
    tracking_history = [{
        "stage": status,
        "date": now_iso,
        "location": shipment_data["sender_address_city"],
        "activity": tracking_activity
    }]
    
    # Extract goods details before sanitizing the rest of the data
    goods_details = shipment_data.pop('goods', [])

    # Sanitize data for model creation, removing extra fields
    model_data = {k: v for k, v in shipment_data.items() if hasattr(Shipment, k) and k != 'goods_details'}
    
    # This is the fix: Remove user_email from the dictionary before unpacking it.
    if 'user_email' in model_data:
        del model_data['user_email']

    new_shipment = Shipment(
        user_id=user.id,
        user_email=user.email,
        shipment_id_str=generate_shipment_id_str(db.session, Shipment),
        status=status,
        tracking_history=tracking_history,
        price_without_tax=price_without_tax,
        tax_amount_18_percent=tax_amount,
        total_with_tax_18_percent=final_total_price,
        goods_details=goods_details, # Correctly assign goods_details
        **model_data
    )
    db.session.add(new_shipment)
    db.session.commit()
    
    shipment_data['pickup_date'] = shipment_data['pickup_date'].isoformat()

    return {
        "message": "Shipment initiated successfully." if status == "Booked" else "Shipment initiated successfully. Please complete payment.",
        "data": {
            **shipment_data,
            "id": new_shipment.id,
            "user_email": new_shipment.user_email,
            "shipment_id_str": new_shipment.shipment_id_str,
            "price_without_tax": float(new_shipment.price_without_tax),
            "tax_amount_18_percent": float(new_shipment.tax_amount_18_percent),
            "total_with_tax_18_percent": float(new_shipment.total_with_tax_18_percent),
            "status": new_shipment.status,
            "tracking_history": new_shipment.tracking_history,
            "goods_details": new_shipment.goods_details,
        }
    }, 201


@shipments_bp.route("/shipments/domestic", methods=["POST"])
def create_domestic_shipment():
    schema = ShipmentCreateSchema()
    data = request.get_json()

    user_email_from_payload = data.get("user_email")
    if not user_email_from_payload:
        return jsonify({"error": "user_email is a required field"}), 400

    user = User.query.filter_by(email=user_email_from_payload).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    final_total_price = data.get("final_total_price_with_tax")
    if final_total_price is None or not isinstance(final_total_price, (int, float)) or final_total_price <= 0:
        return jsonify({"error": "Valid final_total_price_with_tax is required"}), 400
    
    data['receiver_address_country'] = 'India'
    
    try:
        shipment_data = schema.load(data)
    except Exception as e:
        return jsonify({"error": "Invalid shipment details", "details": e.messages}), 400
    
    response, status_code = _create_shipment_record(user, shipment_data, final_total_price)
    return jsonify(response), status_code


@shipments_bp.route("/shipments/international", methods=["POST"])
def create_international_shipment():
    schema = ShipmentCreateSchema()
    data = request.get_json()

    user_email_from_payload = data.get("user_email")
    if not user_email_from_payload:
        return jsonify({"error": "user_email is a required field"}), 400

    user = User.query.filter_by(email=user_email_from_payload).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    final_total_price = data.get("final_total_price_with_tax")
    if final_total_price is None or not isinstance(final_total_price, (int, float)) or final_total_price <= 0:
        return jsonify({"error": "Valid final_total_price_with_tax is required"}), 400

    try:
        shipment_data = schema.load(data)
    except Exception as e:
        return jsonify({"error": "Invalid shipment details", "details": e.messages}), 400

    response, status_code = _create_shipment_record(user, shipment_data, final_total_price)
    return jsonify(response), status_code


@shipments_bp.route("/payments", methods=["POST"])
def submit_payment():
    schema = PaymentSubmitSchema()
    data = request.get_json()

    try:
        payment_data = schema.load(data)
    except Exception as e:
        return jsonify({"error": "Invalid payment details", "details": e.messages}), 400
    
    shipment = Shipment.query.filter_by(shipment_id_str=payment_data['shipment_id_str']).first()
    if not shipment:
        return jsonify({"error": "Shipment not found"}), 404
    
    if shipment.status != "Pending Payment":
        return jsonify({"error": "Payment has already been processed for this shipment"}), 400

    existing_payment = PaymentRequest.query.filter_by(utr=payment_data['utr'], shipment_id=shipment.id).first()
    if existing_payment:
        return jsonify({"error": "This UTR has already been submitted for this shipment"}), 409

    new_payment_request = PaymentRequest(
        user_id=shipment.user_id,
        shipment_id=shipment.id,
        amount=payment_data['amount'],
        utr=payment_data['utr'],
        status='Pending'
    )
    db.session.add(new_payment_request)
    db.session.commit()

    return jsonify({
        "message": "Payment submitted for review successfully.",
        "payment_id": new_payment_request.id,
        "status": new_payment_request.status
    }), 201

@shipments_bp.route("/shipments", methods=["GET"])
def get_user_shipments():
    user_email = request.args.get("email")
    if not user_email:
        return jsonify({"error": "Missing email parameter"}), 400

    from_date_str = request.args.get("from_date")
    to_date_str = request.args.get("to_date")
    status = request.args.get("status")

    query = Shipment.query.filter_by(user_email=user_email)

    if from_date_str:
        try:
            from_date = datetime.fromisoformat(from_date_str.replace("Z", "+00:00")).date()
            query = query.filter(Shipment.booking_date >= from_date)
        except ValueError:
            return jsonify({"error": "Invalid from_date format. Use ISO format."}), 400
    
    if to_date_str:
        try:
            to_date = datetime.fromisoformat(to_date_str.replace("Z", "+00:00")).date()
            query = query.filter(Shipment.booking_date <= to_date)
        except ValueError:
            return jsonify({"error": "Invalid to_date format. Use ISO format."}), 400

    if status and status.lower() != 'all':
        query = query.filter(Shipment.status == status)

    shipments = query.order_by(Shipment.booking_date.desc()).all()

    result = []
    for s in shipments:
        result.append({
            "id": s.id,
            "shipment_id_str": s.shipment_id_str,
            "sender_name": s.sender_name,
            "receiver_name": s.receiver_name,
            "service_type": s.service_type,
            "booking_date": s.booking_date.isoformat(),
            "status": s.status,
            "total_with_tax_18_percent": float(s.total_with_tax_18_percent),
        })
    return jsonify(result), 200

@shipments_bp.route("/shipments/<shipment_id_str>", methods=["GET"])
def get_shipment_detail(shipment_id_str):
    shipment = Shipment.query.filter_by(shipment_id_str=shipment_id_str).first()
    if not shipment:
        return jsonify({"error": "Shipment not found"}), 404

    # Check for an associated payment request
    payment_request = PaymentRequest.query.filter_by(shipment_id=shipment.id).first()
    payment_status = payment_request.status if payment_request else None

    return jsonify({
        "id": shipment.id,
        "shipment_id_str": shipment.shipment_id_str,
        "sender_name": shipment.sender_name,
        "sender_address_street": shipment.sender_address_street,
        "sender_address_city": shipment.sender_address_city,
        "sender_address_state": shipment.sender_address_state,
        "sender_address_pincode": shipment.sender_address_pincode,
        "sender_address_country": shipment.sender_address_country,
        "sender_phone": shipment.sender_phone,
        "user_email": shipment.user_email,
        "receiver_name": shipment.receiver_name,
        "receiver_address_street": shipment.receiver_address_street,
        "receiver_address_city": shipment.receiver_address_city,
        "receiver_address_state": shipment.receiver_address_state,
        "receiver_address_pincode": shipment.receiver_address_pincode,
        "receiver_address_country": shipment.receiver_address_country,
        "receiver_phone": shipment.receiver_phone,
        "package_weight_kg": float(shipment.package_weight_kg),
        "package_length_cm": float(shipment.package_length_cm),
        "package_width_cm": float(shipment.package_width_cm),
        "package_height_cm": float(shipment.package_height_cm),
        "booking_date": shipment.booking_date.isoformat(),
        "service_type": shipment.service_type,
        "status": shipment.status,
        "price_without_tax": float(shipment.price_without_tax),
        "tax_amount_18_percent": float(shipment.tax_amount_18_percent),
        "total_with_tax_18_percent": float(shipment.total_with_tax_18_percent),
        "tracking_history": shipment.tracking_history,
        "payment_status": payment_status,
        "goods_details": shipment.goods_details,
    }), 200

@shipments_bp.route("/user/payments", methods=["GET"])
def get_user_payments():
    user_email = request.args.get("email")
    if not user_email:
        return jsonify({"error": "Missing email parameter"}), 400

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    payments = db.session.query(
        PaymentRequest,
        Shipment.shipment_id_str
    ).join(
        Shipment, PaymentRequest.shipment_id == Shipment.id
    ).filter(
        PaymentRequest.user_id == user.id
    ).order_by(PaymentRequest.created_at.desc()).all()

    result = []
    for payment, shipment_id_str in payments:
        result.append({
            "id": payment.id,
            "shipment_id_str": shipment_id_str,
            "amount": float(payment.amount),
            "utr": payment.utr,
            "status": payment.status,
            "created_at": payment.created_at.isoformat()
        })
    return jsonify(result), 200

@shipments_bp.route("/employee/redeem-code", methods=["POST"])
def redeem_balance_code():
    data = request.get_json()
    code = data.get("code")
    email = data.get("email")

    if not code or not email:
        return jsonify({"error": "Code and email are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    balance_code = BalanceCode.query.filter_by(code=code).first()
    if not balance_code:
        return jsonify({"error": "Invalid code"}), 404
    if balance_code.is_redeemed:
        return jsonify({"error": "This code has already been redeemed"}), 409

    user.balance = (user.balance or 0) + balance_code.amount
    balance_code.is_redeemed = True
    balance_code.redeemed_at = datetime.utcnow()
    balance_code.redeemed_by_user_id = user.id

    db.session.commit()

    return jsonify({
        "message": f"Successfully redeemed code. Amount added: ₹{float(balance_code.amount)}",
        "new_balance": float(user.balance)
    }), 200

@shipments_bp.route('/employee/day-end-stats', methods=['GET'])
def get_day_end_stats():
    user_email = request.headers.get("X-User-Email")
    if not user_email:
        return jsonify({"error": "Authentication required"}), 401
    
    user = User.query.filter_by(email=user_email).first()
    if not user or not user.is_employee:
        return jsonify({"error": "Employee not found or not authorized"}), 403

    # Base query for all shipments by the user
    all_shipments_query = Shipment.query.filter(
        Shipment.user_id == user.id
    )
    
    # Calculate stats
    total_shipments_count = all_shipments_query.count()
    total_shipments_value = all_shipments_query.with_entities(
        func.sum(Shipment.total_with_tax_18_percent)
    ).scalar() or 0
    
    # Get shipments for the table
    all_shipments_list = all_shipments_query.order_by(Shipment.booking_date.desc()).all()
    shipments_result = [{
        "id": s.id,
        "shipment_id_str": s.shipment_id_str,
        "receiver_name": s.receiver_name,
        "status": s.status,
        "total_with_tax_18_percent": float(s.total_with_tax_18_percent)
    } for s in all_shipments_list]


    return jsonify({
        "current_balance": float(user.balance),
        "total_shipments_count": total_shipments_count,
        "total_shipments_value": float(total_shipments_value),
        "all_shipments": shipments_result,
    }), 200


# --- Employee Address Book ---
@shipments_bp.route("/employee/addresses", methods=["POST"])
def add_employee_saved_address():
    user_email = request.headers.get("X-User-Email")
    if not user_email:
        return jsonify({"error": "User not found"}), 404
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    schema = SavedAddressSchema()
    try:
        address_data = schema.load(request.get_json())
    except Exception as e:
        return jsonify({"error": "Invalid address data", "details": e.messages}), 400

    new_address = SavedAddress(user_id=user.id, **address_data)
    
    try:
        db.session.add(new_address)
        db.session.commit()
    except exc.IntegrityError:
        db.session.rollback()
        return jsonify({"error": f"An address with the nickname '{address_data['nickname']}' already exists for this address type."}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not save address.", "details": str(e)}), 500

    return jsonify(schema.dump(new_address)), 201

@shipments_bp.route("/employee/addresses", methods=["GET"])
def get_employee_saved_addresses():
    user_email = request.headers.get("X-User-Email")
    if not user_email:
        return jsonify({"error": "User not found"}), 404
        
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    address_type = request.args.get('type')
    query = SavedAddress.query.filter_by(user_id=user.id)

    if address_type in ['sender', 'receiver']:
        query = query.filter_by(address_type=address_type)
    
    addresses = query.order_by(SavedAddress.nickname).all()
    schema = SavedAddressSchema(many=True)
    return jsonify(schema.dump(addresses)), 200

@shipments_bp.route("/employee/addresses/<int:address_id>", methods=["DELETE"])
def delete_employee_saved_address(address_id):
    user_email = request.headers.get("X-User-Email")
    if not user_email:
        return jsonify({"error": "User not found"}), 404
        
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    address = SavedAddress.query.filter_by(id=address_id, user_id=user.id).first()
    if not address:
        return jsonify({"error": "Address not found or permission denied"}), 404
    
    db.session.delete(address)
    db.session.commit()
    return jsonify({"message": "Address deleted"}), 200
    
# --- Customer Address Book ---
@shipments_bp.route("/customer/addresses", methods=["POST", "GET"])
def handle_customer_addresses():
    user_email = request.headers.get("X-User-Email")
    if not user_email:
        return jsonify({"error": "User authentication required."}), 401
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404
    
    if request.method == 'POST':
        schema = SavedAddressSchema()
        try:
            address_data = schema.load(request.get_json())
        except Exception as e:
            return jsonify({"error": "Invalid address data", "details": e.messages}), 400

        new_address = SavedAddress(user_id=user.id, **address_data)
        try:
            db.session.add(new_address)
            db.session.commit()
        except exc.IntegrityError:
            db.session.rollback()
            return jsonify({"error": f"An address with the nickname '{address_data['nickname']}' already exists."}), 409
        return jsonify(schema.dump(new_address)), 201
    
    if request.method == 'GET':
        address_type = request.args.get('type')
        query = SavedAddress.query.filter_by(user_id=user.id)
        if address_type in ['sender', 'receiver']:
            query = query.filter_by(address_type=address_type)
        addresses = query.order_by(SavedAddress.nickname).all()
        schema = SavedAddressSchema(many=True)
        return jsonify(schema.dump(addresses)), 200

@shipments_bp.route("/customer/addresses/<int:address_id>", methods=["PUT", "DELETE"])
def handle_customer_address_item(address_id):
    user_email = request.headers.get("X-User-Email")
    if not user_email:
        return jsonify({"error": "User authentication required."}), 401
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    address = SavedAddress.query.filter_by(id=address_id, user_id=user.id).first_or_404()

    if request.method == 'PUT':
        schema = SavedAddressSchema()
        try:
            address_data = schema.load(request.get_json())
        except Exception as e:
            return jsonify({"error": "Invalid address data", "details": e.messages}), 400
        
        for key, value in address_data.items():
            setattr(address, key, value)
        
        try:
            db.session.commit()
        except exc.IntegrityError:
            db.session.rollback()
            return jsonify({"error": f"An address with the nickname '{address_data['nickname']}' already exists."}), 409
        return jsonify(schema.dump(address)), 200

    if request.method == 'DELETE':
        db.session.delete(address)
        db.session.commit()
        return jsonify({"message": "Address deleted"}), 200

      

    