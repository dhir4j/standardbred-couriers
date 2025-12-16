
from flask import Blueprint, request, jsonify
from app.models import Shipment, User, PaymentRequest, BalanceCode
from app.extensions import db
from sqlalchemy import or_, func, and_
from sqlalchemy.orm.attributes import flag_modified
from datetime import datetime
import string
import random
from werkzeug.security import generate_password_hash
from functools import wraps
from decimal import Decimal, InvalidOperation
from app.utils import generate_shipment_id_str

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# --- Admin Authentication Decorator ---
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_email = request.headers.get("X-User-Email")
        if not user_email:
            return jsonify({"error": "Authentication required: Missing user email header"}), 401
        
        user = User.query.filter_by(email=user_email).first()
        if not user or not user.is_admin:
            return jsonify({"error": "Forbidden: Admin access required"}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def generate_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@admin_bp.route("/create-invoice-from-payment", methods=["POST"])
def create_invoice_from_payment():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    transaction = data.get("transaction")
    order_data = data.get("order")

    if not transaction or not order_data:
        return jsonify({"error": "Missing 'transaction' or 'order' data"}), 400
    
    sender_data = order_data.get("sender")
    receiver_data = order_data.get("receiver")

    if not sender_data or not receiver_data:
        return jsonify({"error": "Missing 'sender' or 'receiver' data within the 'order' object"}), 400

    admin_user = User.query.filter_by(email="dhillon@logistix.com").first()
    if not admin_user:
        return jsonify({"error": "Default admin user 'dhillon@logistix.com' not found. Please run the add_admin.py script."}), 404

    try:
        total_price = Decimal(transaction.get("amount"))
        weight_kg = Decimal(transaction.get("weight", 0))
        price_without_tax = total_price / Decimal("1.18")
        tax_amount = total_price - price_without_tax
        now_iso = datetime.utcnow().isoformat()
        
        sender_street = f"{sender_data.get('address_line1', '')} {sender_data.get('address_line2', '')}".strip()
        receiver_street = f"{receiver_data.get('address_line1', '')} {receiver_data.get('address_line2', '')}".strip()

        # Random descriptions for goods
        possible_descriptions = [
            "Paper Goods", "Printed Material", "Sample Documents", 
            "Commercial Sample", "Marketing Material"
        ]
        random_description = random.choice(possible_descriptions)
        
        goods_description_with_weight = f"{random_description} ({weight_kg} kg)"

        new_shipment = Shipment(
            user_id=admin_user.id,
            user_email=admin_user.email,
            shipment_id_str=generate_shipment_id_str(db.session, Shipment),
            
            sender_name=sender_data.get("name"),
            sender_address_street=sender_street,
            sender_address_city=sender_data.get("city"),
            sender_address_state=sender_data.get("state"),
            sender_address_pincode=sender_data.get("pincode"),
            sender_address_country=sender_data.get("country"),
            sender_phone=sender_data.get("phone"),

            receiver_name=receiver_data.get("name"),
            receiver_address_street=receiver_street,
            receiver_address_city=receiver_data.get("city"),
            receiver_address_state=receiver_data.get("state"),
            receiver_address_pincode=receiver_data.get("pincode"),
            receiver_address_country=receiver_data.get("country"),
            receiver_phone=receiver_data.get("phone"),

            package_weight_kg=weight_kg,
            package_length_cm=0,
            package_width_cm=0,
            package_height_cm=0,
            
            goods_details=[{
                "description": goods_description_with_weight,
                "quantity": 1,
                "value": float(price_without_tax), # Value is price before tax
                "hsn_code": "996812" # HSN for courier services
            }],

            pickup_date=datetime.strptime(transaction.get("date"), "%Y-%m-%d").date() if transaction.get("date") else datetime.utcnow().date(),
            service_type="Reconciled",
            status="Booked",

            price_without_tax=price_without_tax,
            tax_amount_18_percent=tax_amount,
            total_with_tax_18_percent=total_price,

            tracking_history=[{
                "stage": "Booked",
                "date": now_iso,
                "location": sender_data.get("city", "N/A"),
                "activity": f"Shipment booked and paid via {transaction.get('type', 'N/A')}. UTR: {transaction.get('utr', 'N/A')}"
            }]
        )

        db.session.add(new_shipment)
        db.session.commit()

        return jsonify({
            "message": "Paid invoice and shipment created successfully.",
            "shipment_id_str": new_shipment.shipment_id_str,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@admin_bp.route("/balance-codes", methods=["POST"])
@admin_required
def create_balance_code():
    data = request.get_json()
    amount_str = data.get("amount")
    
    if not amount_str:
        return jsonify({"error": "Amount is required"}), 400

    try:
        amount = Decimal(amount_str)
        if amount <= 0:
            raise ValueError()
    except (InvalidOperation, ValueError):
        return jsonify({"error": "Valid, positive amount is required"}), 400

    new_code = BalanceCode(
        code=f"TOPUP-{generate_code(length=8)}",
        amount=amount
    )
    db.session.add(new_code)
    db.session.commit()
    return jsonify({
        "message": "Balance code created successfully",
        "code": new_code.code,
        "amount": float(new_code.amount)
    }), 201

@admin_bp.route("/balance-codes", methods=["GET"])
@admin_required
def get_balance_codes():
    status = request.args.get("status")

    query = db.session.query(
        BalanceCode,
        User.email
    ).outerjoin(
        User, BalanceCode.redeemed_by_user_id == User.id
    )

    if status == 'active':
        query = query.filter(BalanceCode.is_redeemed == False)
    elif status == 'redeemed':
        query = query.filter(BalanceCode.is_redeemed == True)

    codes = query.order_by(BalanceCode.created_at.desc()).all()
    
    result = []
    for code, email in codes:
        result.append({
            "id": code.id,
            "code": code.code,
            "amount": float(code.amount),
            "is_redeemed": code.is_redeemed,
            "created_at": code.created_at.isoformat(),
            "redeemed_at": code.redeemed_at.isoformat() if code.redeemed_at else None,
            "redeemed_by": email
        })
    return jsonify(result), 200

@admin_bp.route("/balance-codes/<int:code_id>", methods=["DELETE"])
@admin_required
def delete_balance_code(code_id):
    code = BalanceCode.query.get(code_id)
    if not code:
        return jsonify({"error": "Code not found"}), 404
    
    if code.is_redeemed:
        return jsonify({"error": "Cannot delete a redeemed code"}), 400

    db.session.delete(code)
    db.session.commit()
    
    return jsonify({"message": "Balance code deleted successfully"}), 200

@admin_bp.route("/shipments", methods=["GET"])
@admin_required
def get_all_shipments():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    status = request.args.get("status")
    q = request.args.get("q")
    
    query = db.session.query(
        Shipment,
        User.is_employee
    ).join(User, Shipment.user_id == User.id)

    # By default, do not show shipments that are pending payment
    if not status or status.lower() == 'all':
        query = query.filter(Shipment.status != 'Pending Payment')
    elif status:
        query = query.filter(Shipment.status == status)

    if q:
        like_q = f"%{q}%"
        query = query.filter(
            or_(
                Shipment.shipment_id_str.ilike(like_q),
                Shipment.sender_name.ilike(like_q),
                Shipment.receiver_name.ilike(like_q),
                User.email.ilike(like_q)
            )
        )
    
    total_count = query.count()
    pagination = query.order_by(Shipment.booking_date.desc()).paginate(page=page, per_page=limit, error_out=False)
    shipments_with_user_type = pagination.items

    result = []
    for s, is_employee in shipments_with_user_type:
        result.append({
            "id": s.id,
            "shipment_id_str": s.shipment_id_str,
            "sender_name": s.sender_name,
            "receiver_name": s.receiver_name,
            "receiver_address_city": s.receiver_address_city,
            "service_type": s.service_type,
            "package_weight_kg": float(s.package_weight_kg),
            "booking_date": s.booking_date.isoformat(),
            "status": s.status,
            "price_without_tax": float(s.price_without_tax),
            "tax_amount_18_percent": float(s.tax_amount_18_percent),
            "total_with_tax_18_percent": float(s.total_with_tax_18_percent),
            "user_type": "Employee" if is_employee else "Customer",
        })
    return jsonify({
        "shipments": result,
        "totalPages": pagination.pages or 1,
        "currentPage": page,
        "totalCount": total_count
    }), 200

@admin_bp.route("/shipments/bulk-status-update", methods=["POST"])
@admin_required
def bulk_update_shipment_status():
    data = request.get_json()
    shipment_ids = data.get("shipment_ids")
    new_status = data.get("status")

    valid_statuses = ['Booked', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled']
    if not all([shipment_ids, new_status]) or new_status not in valid_statuses:
        return jsonify({"error": "Invalid payload: shipment_ids and a valid status are required."}), 400
    
    if not isinstance(shipment_ids, list) or len(shipment_ids) == 0:
        return jsonify({"error": "shipment_ids must be a non-empty list."}), 400

    try:
        updated_count = 0
        now_iso = datetime.utcnow().isoformat()
        
        # Query all shipments at once
        shipments_to_update = Shipment.query.filter(Shipment.id.in_(shipment_ids)).all()

        for shipment in shipments_to_update:
            shipment.status = new_status
            
            entry = {
                "stage": new_status,
                "date": now_iso,
                "location": "",  # Location is not provided in bulk update
                "activity": f"Status updated to {new_status} via bulk action.",
            }
            
            history = shipment.tracking_history or []
            history.append(entry)
            shipment.tracking_history = history
            flag_modified(shipment, "tracking_history")
            updated_count += 1

        db.session.commit()

        return jsonify({
            "message": f"Successfully updated status for {updated_count} shipments to '{new_status}'.",
            "updated_count": updated_count
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An unexpected error occurred during bulk update: {str(e)}"}), 500


@admin_bp.route("/shipments/<shipment_id_str>/status", methods=["PUT"])
@admin_required
def update_shipment_status(shipment_id_str):
    data = request.get_json()
    new_status = data.get("status")
    location = data.get("location")
    activity = data.get("activity")

    valid_statuses = ['Booked', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled']
    if not new_status or new_status not in valid_statuses:
        return jsonify({"error": "Invalid or missing status"}), 400

    shipment = Shipment.query.filter_by(shipment_id_str=shipment_id_str).first()
    if not shipment:
        return jsonify({"error": "Shipment not found"}), 404

    shipment.status = new_status
    entry = {
        "stage": new_status,
        "date": datetime.utcnow().isoformat(),
        "location": location or "",
        "activity": activity or f"Status updated to {new_status}",
    }
    history = shipment.tracking_history or []
    history.append(entry)
    shipment.tracking_history = history
    flag_modified(shipment, "tracking_history")
    db.session.commit()

    return jsonify({
        "message": "Shipment status updated successfully",
        "updatedShipment": {
            "shipment_id_str": shipment.shipment_id_str,
            "status": shipment.status,
            "tracking_history": shipment.tracking_history,
        }
    }), 200

@admin_bp.route("/web_analytics", methods=["GET"])
@admin_required
def web_analytics():
    total_orders = db.session.query(func.count(Shipment.id)).scalar() or 0
    total_revenue = db.session.query(func.coalesce(func.sum(Shipment.total_with_tax_18_percent), 0)).scalar() or 0.0
    total_users = db.session.query(func.count(User.id)).filter(User.is_admin == False, User.is_employee == False).scalar() or 0
    avg_revenue = (total_revenue / total_orders) if total_orders > 0 else 0.0

    return jsonify({
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "avg_revenue": float(avg_revenue),
        "total_users": total_users
    }), 200

@admin_bp.route("/payments", methods=["GET"])
@admin_required
def get_payments():
    payments_query = db.session.query(
        PaymentRequest,
        User.first_name,
        User.last_name,
        Shipment.shipment_id_str
    ).join(
        User, PaymentRequest.user_id == User.id
    ).join(
        Shipment, PaymentRequest.shipment_id == Shipment.id
    ).order_by(PaymentRequest.created_at.desc()).all()

    result = []
    for payment, first_name, last_name, shipment_id_str in payments_query:
        result.append({
            "id": payment.id,
            "order_id": shipment_id_str,
            "first_name": first_name,
            "last_name": last_name,
            "amount": float(payment.amount),
            "utr": payment.utr,
            "status": payment.status,
            "created_at": payment.created_at.isoformat()
        })
    return jsonify(result), 200

@admin_bp.route("/payments/<int:payment_id>/status", methods=["PUT"])
@admin_required
def update_payment_status(payment_id):
    data = request.get_json()
    new_status = data.get("status")

    if new_status not in ["Approved", "Rejected"]:
        return jsonify({"error": "Invalid status"}), 400

    payment = PaymentRequest.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    
    if payment.status != 'Pending':
        return jsonify({"error": "Payment has already been processed"}), 400

    payment.status = new_status

    if new_status == "Approved":
        shipment = Shipment.query.get(payment.shipment_id)
        if shipment:
            shipment.status = "Booked"
            now_iso = datetime.utcnow().isoformat()
            history = shipment.tracking_history or []
            found = False
            for entry in history:
                if entry.get("stage") == "Pending Payment":
                    entry["stage"] = "Booked"
                    entry["date"] = now_iso
                    entry["activity"] = "Shipment booked and payment confirmed."
                    found = True
                    break
            if not found:
                 history.insert(0, {
                    "stage": "Booked",
                    "date": now_iso,
                    "location": shipment.sender_address_city,
                    "activity": "Shipment booked and payment confirmed."
                 })
            shipment.tracking_history = history
            flag_modified(shipment, "tracking_history")


    db.session.commit()
    return jsonify({"message": f"Payment {new_status.lower()} successfully"}), 200

@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    q = request.args.get("q")
    # Only get customers (not admins, not employees)
    query = User.query.filter(User.is_admin == False, User.is_employee == False)

    if q:
        like_q = f"%{q}%"
        query = query.filter(
            or_(
                User.first_name.ilike(like_q),
                User.last_name.ilike(like_q),
                User.email.ilike(like_q)
            )
        )
    
    total_count = query.count()
    pagination = query.order_by(User.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
    users = pagination.items

    result = []
    for user in users:
        result.append({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "created_at": user.created_at.isoformat(),
            "shipment_count": len(user.shipments)
        })

    return jsonify({
        "users": result,
        "totalPages": pagination.pages or 1,
        "currentPage": page,
        "totalCount": total_count
    }), 200

@admin_bp.route("/users/<int:user_id>", methods=["GET"])
@admin_required
def get_user_details(user_id):
    user = User.query.get_or_404(user_id)
    if user.is_admin:
        return jsonify({"error": "Cannot access admin user details"}), 403

    shipments_query = Shipment.query.filter_by(user_id=user.id).order_by(Shipment.booking_date.desc()).all()
    shipments_result = []
    for s in shipments_query:
        shipments_result.append({
            "id": s.id,
            "shipment_id_str": s.shipment_id_str,
            "receiver_name": s.receiver_name,
            "booking_date": s.booking_date.isoformat(),
            "status": s.status,
            "total_with_tax_18_percent": float(s.total_with_tax_18_percent),
        })

    payments_query = PaymentRequest.query.filter_by(user_id=user.id).order_by(PaymentRequest.created_at.desc()).all()
    payments_result = []
    for p in payments_query:
        shipment_for_payment = Shipment.query.get(p.shipment_id)
        shipment_id_str_for_payment = shipment_for_payment.shipment_id_str if shipment_for_payment else "N/A"
        payments_result.append({
            "id": p.id,
            "shipment_id_str": shipment_id_str_for_payment,
            "amount": float(p.amount),
            "utr": p.utr,
            "status": p.status,
            "created_at": p.created_at.isoformat()
        })
    
    user_details = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "created_at": user.created_at.isoformat(),
        "is_employee": user.is_employee,
    }

    if user.is_employee:
        user_details["balance"] = float(user.balance)

    return jsonify({
        "user": user_details,
        "shipments": shipments_result,
        "payments": payments_result
    }), 200

# --- Employee CRUD ---

@admin_bp.route("/employees", methods=["POST"])
@admin_required
def create_employee():
    data = request.get_json()
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_employee = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=hashed_password,
        is_admin=False,
        is_employee=True
    )
    db.session.add(new_employee)
    db.session.commit()

    return jsonify({
        "message": "Employee created successfully",
        "user": {
            "id": new_employee.id,
            "email": new_employee.email,
            "firstName": new_employee.first_name,
            "lastName": new_employee.last_name
        }
    }), 201
  
@admin_bp.route("/employees", methods=["GET"])
@admin_required
def get_all_employees():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    q = request.args.get("q")
    query = User.query.filter_by(is_employee=True)

    if q:
        like_q = f"%{q}%"
        query = query.filter(
            or_(
                User.first_name.ilike(like_q),
                User.last_name.ilike(like_q),
                User.email.ilike(like_q)
            )
        )
    
    total_count = query.count()
    pagination = query.order_by(User.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
    employees = pagination.items

    result = []
    for user in employees:
        result.append({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "created_at": user.created_at.isoformat(),
            "shipment_count": len(user.shipments),
            "balance": float(user.balance)
        })

    return jsonify({
        "users": result,
        "totalPages": pagination.pages or 1,
        "currentPage": page,
        "totalCount": total_count
    }), 200

@admin_bp.route("/employees/<int:employee_id>", methods=["PUT"])
@admin_required
def update_employee(employee_id):
    employee = User.query.get_or_404(employee_id)
    if not employee.is_employee:
        return jsonify({"error": "This is not an employee account"}), 400

    data = request.get_json()
    
    # Update fields if they exist in the request
    if 'firstName' in data:
        employee.first_name = data['firstName']
    if 'lastName' in data:
        employee.last_name = data['lastName']
    if 'email' in data and data['email'] != employee.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already in use"}), 409
        employee.email = data['email']
    if 'password' in data and data['password']:
        employee.password = generate_password_hash(data['password'])

    db.session.commit()
    return jsonify({"message": "Employee updated successfully"}), 200

@admin_bp.route("/employees/<int:employee_id>", methods=["DELETE"])
@admin_required
def delete_employee(employee_id):
    employee = User.query.get_or_404(employee_id)
    if not employee.is_employee:
        return jsonify({"error": "This is not an employee account"}), 400

    # You might want to decide what to do with their shipments.
    # For now, we will just delete the user. The shipments will remain
    # but the user_id will point to a non-existent user unless you set up
    # specific cascade delete behavior or handle it manually.
    
    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted successfully"}), 200

    


    




    

    