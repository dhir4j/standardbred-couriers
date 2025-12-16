
from marshmallow import Schema, fields, validate

class SignupSchema(Schema):
    first_name = fields.Str(required=True, validate=validate.Length(min=1, error="First name is required."))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, error="Last name is required."))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6, error="Password must be at least 6 characters."))

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class GoodsSchema(Schema):
    description = fields.Str(required=True)
    quantity = fields.Int(required=True)
    hsn_code = fields.Str(allow_none=True)
    value = fields.Float(required=True)

class ShipmentCreateSchema(Schema):
    # Sender
    sender_name = fields.Str(required=True)
    sender_address_street = fields.Str(required=True)
    sender_address_city = fields.Str(required=True)
    sender_address_state = fields.Str(required=True)
    sender_address_pincode = fields.Str(required=True)
    sender_address_country = fields.Str(required=True)
    sender_phone = fields.Str(required=True)

    # Receiver
    receiver_name = fields.Str(required=True)
    receiver_address_street = fields.Str(required=True)
    receiver_address_city = fields.Str(required=True)
    receiver_address_state = fields.Str(required=True)
    receiver_address_pincode = fields.Str(required=True)
    receiver_phone = fields.Str(required=True)
    receiver_address_country = fields.Str(required=True)

    # Package
    package_weight_kg = fields.Float(required=True)
    package_length_cm = fields.Float(required=True)
    package_width_cm = fields.Float(required=True)
    package_height_cm = fields.Float(required=True)
    pickup_date = fields.Date(required=True)
    service_type = fields.Str(required=True, allow_none=True)
    goods = fields.List(fields.Nested(GoodsSchema), required=True)


    # Optional fields for saving addresses
    save_sender_address = fields.Bool(load_default=False)
    sender_address_nickname = fields.Str(allow_none=True)
    save_receiver_address = fields.Bool(load_default=False)
    receiver_address_nickname = fields.Str(allow_none=True)
    
    # Extra fields from form that are not part of the model
    shipmentType = fields.Str(allow_none=True)
    user_email = fields.Email(required=True)
    final_total_price_with_tax = fields.Float(required=True)


class PaymentSubmitSchema(Schema):
    shipment_id_str = fields.Str(required=True)
    utr = fields.Str(required=True, validate=validate.Length(min=12, max=12, error="UTR must be 12 digits."))
    amount = fields.Float(required=True)

class SavedAddressSchema(Schema):
    id = fields.Int(dump_only=True)
    address_type = fields.Str(required=True, validate=validate.OneOf(["sender", "receiver"]))
    nickname = fields.Str(required=True, validate=validate.Length(min=2))
    name = fields.Str(required=True)
    address_street = fields.Str(required=True)
    address_city = fields.Str(required=True)
    address_state = fields.Str(required=True)
    address_pincode = fields.Str(required=True)
    address_country = fields.Str(required=True)
    phone = fields.Str(required=True)

    class Meta:
        fields = ("id", "nickname", "name", "address_street", "address_city", "address_state", "address_pincode", "address_country", "phone", "address_type")

