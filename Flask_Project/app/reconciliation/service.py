import random

# This new system uses a predefined lookup table for suggestions.
# It provides more realistic and varied results than reverse-calculating from price lists.

SUGGESTION_LOOKUP = [
    {
        "range": (0, 750),
        "suggestions": [
            {"destinations": ["Mumbai"], "weight_suggestion": "1kg", "mode": "Express"},
            {"destinations": ["Delhi"], "weight_suggestion": "1.5kg", "mode": "Air"},
            {"destinations": ["Pune"], "weight_suggestion": "1kg", "mode": "Express"},
            {"destinations": ["Bangalore"], "weight_suggestion": "2kg", "mode": "Air"},
            {"destinations": ["Chennai"], "weight_suggestion": "1.5kg", "mode": "Surface"},
            {"destinations": ["Ahmedabad"], "weight_suggestion": "2kg", "mode": "Surface"},
            {"destinations": ["Jaipur"], "weight_suggestion": "1.5kg", "mode": "Surface"},
            {"destinations": ["Lucknow"], "weight_suggestion": "2kg", "mode": "Surface"},
            {"destinations": ["Surat"], "weight_suggestion": "1kg", "mode": "Express"},
            {"destinations": ["Nagpur"], "weight_suggestion": "1.5kg", "mode": "Surface"},
            {"destinations": ["Haryana"], "weight_suggestion": "0.5kg", "mode": "Express"},
            {"destinations": ["Punjab"], "weight_suggestion": "1kg", "mode": "Express"},
        ]
    },
    {
        "range": (751, 1500),
        "suggestions": [
            {"destinations": ["Mumbai"], "weight_suggestion": "5kg", "mode": "Air"},
            {"destinations": ["Punjab"], "weight_suggestion": "6kg", "mode": "Surface"},
            {"destinations": ["Odisha"], "weight_suggestion": "2kg", "mode": "Air"},
            {"destinations": ["Delhi"], "weight_suggestion": "4kg", "mode": "Air"},
            {"destinations": ["Bangalore"], "weight_suggestion": "5.5kg", "mode": "Air"},
            {"destinations": ["Kerala"], "weight_suggestion": "3kg", "mode": "Air"},
            {"destinations.py": ["Rajasthan"], "weight_suggestion": "4.5kg", "mode": "Surface"},
            {"destinations": ["Gujarat"], "weight_suggestion": "5kg", "mode": "Surface"},
            {"destinations": ["Kolkata"], "weight_suggestion": "3.5kg", "mode": "Air"},
            {"destinations": ["Hyderabad"], "weight_suggestion": "4kg", "mode": "Air"},
        ]
    },
    {
        "range": (1501, 3000),
        "suggestions": [
            {"destinations": ["Jammu & Kashmir"], "weight_suggestion": "8kg", "mode": "Surface"},
            {"destinations": ["Assam"], "weight_suggestion": "10kg", "mode": "Surface"},
            {"destinations": ["Mumbai"], "weight_suggestion": "12kg", "mode": "Surface"},
            {"destinations": ["Punjab"], "weight_suggestion": "15kg", "mode": "Surface"},
            {"destinations": ["Kerala"], "weight_suggestion": "9kg", "mode": "Air"},
            {"destinations": ["Goa"], "weight_suggestion": "8kg", "mode": "Air"},
            {"destinations": ["Port Blair"], "weight_suggestion": "7kg", "mode": "Air"},
            {"destinations": ["Delhi"], "weight_suggestion": "13kg", "mode": "Surface"},
            {"destinations": ["Bangalore"], "weight_suggestion": "11kg", "mode": "Air"},
            {"destinations": ["Kolkata"], "weight_suggestion": "10kg", "mode": "Air"},
        ]
    },
    {
        "range": (3001, float('inf')),
        "suggestions": [
            {"destinations": ["UK"], "weight_suggestion": "2kg", "mode": "International"},
            {"destinations": ["USA"], "weight_suggestion": "1kg", "mode": "International"},
            {"destinations": ["Canada"], "weight_suggestion": "1kg", "mode": "International"},
            {"destinations": ["Australia"], "weight_suggestion": "1.5kg", "mode": "International"},
            {"destinations": ["Germany"], "weight_suggestion": "2.5kg", "mode": "International"},
            {"destinations": ["Singapore"], "weight_suggestion": "3kg", "mode": "International"},
            {"destinations": ["UAE"], "weight_suggestion": "4kg", "mode": "International"},
            {"destinations": ["South Africa"], "weight_suggestion": "1.5kg", "mode": "International"},
            {"destinations": ["New Zealand"], "weight_suggestion": "1kg", "mode": "International"},
        ]
    }
]

def get_shipment_suggestion(amount: float):
    """
    Selects a random shipment suggestion from a predefined lookup table based on the amount.
    """
    for item in SUGGESTION_LOOKUP:
        min_val, max_val = item["range"]
        if min_val <= amount <= max_val:
            selected_suggestion = random.choice(item["suggestions"])
            
            # Determine type based on amount or explicitly
            shipment_type = "International" if amount > 3000 else "Domestic"
            
            return {
                "type": shipment_type,
                "destinations": selected_suggestion["destinations"],
                "mode": selected_suggestion["mode"],
                "weight_suggestion": selected_suggestion["weight_suggestion"],
                "total_price_with_tax": amount, # Return the original amount for display
            }
            
    return None
