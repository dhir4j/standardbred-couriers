# API Documentation

This document provides details on how to use the custom API endpoints for payment reconciliation and invoice creation.

---

## 1. Find Potential Shipments by Amount

This endpoint is used to find potential shipment configurations (domestic or international) that match a given transaction amount. It's a "reverse lookup" for your pricing model.

- **URL**: `/api/reconciliation/find-destinations`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

The request body must be a JSON object containing the total amount of the transaction (inclusive of tax).

```json
{
  "amount": 354.00
}
```

### Logic

- If the `amount` is less than 5000, the system searches for matching **domestic** shipments.
- If the `amount` is 5000 or greater, the system searches for matching **international** shipments.

The logic reverses the 18% GST calculation to find the base price and then searches through the pricing tables to find configurations that match.

### Success Response (`200 OK`)

Returns a JSON object with a `matches` array. Each object in the array represents a possible shipment configuration.

**Example Response:**

```json
{
  "matches": [
    {
      "calculated_base_price": 300,
      "destinations": [
        "Rajasthan",
        "Uttar Pradesh",
        "Uttarakhand"
      ],
      "mode": "Express",
      "total_price_with_tax": 354.0,
      "type": "Domestic",
      "weight_suggestion": "Approx. 1 kg"
    }
  ]
}
```

### Error Response (`400 Bad Request`)

If the amount is missing or invalid.

```json
{
  "error": "A valid, positive amount is required."
}
```

---

## 2. Create Paid Invoice from Matched Data

This endpoint creates a new `Shipment` record with a "Booked" status, using data from a matched bank transaction and order details. This is for use in your desktop application to inject paid orders into the system. **This is a public endpoint and does not require authentication.**

- **URL**: `/api/admin/create-invoice-from-payment`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

The request body must be a JSON object containing `transaction`, `sender`, and `receiver` details.

**Example Request:**

```json
{
  "transaction": {
    "date": "2025-01-15",
    "utr": "390044192516",
    "amount": 500.0,
    "weight": 0.5,
    "type": "UPI",
    "payment_status": "completed"
  },
  "sender": {
    "name": "Sanjiv Kumar",
    "address_line1": "test address 1",
    "address_line2": "NEAR PUNJAB & SIND BANK",
    "city": "LUDHIANA",
    "state": "PUNJAB",
    "pincode": "141002",
    "country": "India",
    "phone": "+91 8544970282"
  },
  "receiver": {
    "name": "DURGESH KUMAR",
    "address_line1": "Plot No. 45, Sector 21",
    "address_line2": "Near City Mall",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411001",
    "country": "India",
    "phone": "+91 9876543210"
  }
}
```

### Success Response (`201 Created`)

Returns a confirmation message and the newly generated unique `shipment_id_str` for the created shipment.

**Example Response:**

```json
{
  "message": "Paid invoice and shipment created successfully.",
  "shipment_id_str": "SBC1A2B3C4D5E6"
}
```

### Error Responses

- **`400 Bad Request`**: If the JSON payload is invalid or missing required fields.
  ```json
  { "error": "Invalid JSON payload" }
  ```
  ```json
  { "error": "Missing 'transaction', 'sender', or 'receiver' data" }
  ```
- **`404 Not Found`**: If the default admin user (to associate the shipment with) is not found in the database.
  ```json
  { "error": "Default admin user 'dhillon@logistix.com' not found. Please run the add_admin.py script." }
  ```
