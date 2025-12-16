
import math
from flask import Blueprint, request, jsonify
from app.services.pricing_service import calculate_international_price

international_bp = Blueprint("international", __name__, url_prefix="/api/international")

@international_bp.route("/price", methods=["POST"])
def intl_price():
    try:
        data = request.get_json()
        country = data.get("country", "").strip().lower()
        weight_kg = float(data.get("weight", 0.5))
        
        if not country or weight_kg <= 0:
            return jsonify({"error": "Country and positive weight are required"}), 400

        # Call the new pricing service
        price_result = calculate_international_price(country, weight_kg)

        if "error" in price_result:
            return jsonify(price_result), 404

        # Apply only the 18% tax, no other discounts
        final_price = round(price_result["base_price"] * 1.18, 2)

        return jsonify({
            "country": price_result["country_name"],
            "zone": price_result["zone"],
            "mode": "Express",
            "weight_kg": weight_kg,
            "rounded_weight": price_result["rounded_weight"],
            "price_per_kg": f"₹{price_result['per_kg_rate']}",
            "total_price": final_price
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
