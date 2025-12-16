
import random
import string

def generate_shipment_id_str(session, ShipmentModel):
    """
    Generates a unique random shipment ID like SBC1A2B3C4D5E6,
    ensuring it doesn't already exist in the database.
    """
    while True:
        shipment_id = "SBC" + "".join(random.choices(string.ascii_uppercase + string.digits, k=12))
        exists = session.query(ShipmentModel).filter_by(shipment_id_str=shipment_id).first()
        if not exists:
            return shipment_id

    

    