from flask import Blueprint, request, jsonify
from .service import get_shipment_suggestion

reconciliation_bp = Blueprint("reconciliation", __name__, url_prefix="/api/reconciliation")

@reconciliation_bp.route("/find-destinations", methods=["POST"])
def find_destinations():
    data = request.get_json()
    amount = data.get("amount")

    if not isinstance(amount, (int, float)) or amount <= 0:
        return jsonify({"error": "A valid, positive amount is required."}), 400

    try:
        suggestion = get_shipment_suggestion(float(amount))
        if not suggestion:
            return jsonify({"message": "No potential shipment match found for this amount."}), 404
        
        return jsonify(suggestion), 200
    except Exception as e:
        # In a real app, you'd log the error.
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
