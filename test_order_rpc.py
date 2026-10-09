import urllib.request
import json
import uuid
import hashlib

SUPABASE_URL = "https://wpcqqpzkavciiugwvqsn.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwY3FxcHprYXZjaWl1Z3d2cXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDM0NDE5MywiZXhwIjoyMTA1OTIwMTkzfQ.f_Om_il7HKq6ZrRtgaYKT8VtVj6vnU8oOFi57sXi6_0"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

# 1. Fetch an active product
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/products?slug=eq.creme-d-argan&select=id,name,price,stock_quantity", headers=headers)
with urllib.request.urlopen(req) as resp:
    products = json.loads(resp.read().decode('utf-8'))
    print("Found product:", products)
    product = products[0]

# 2. Prepare order payload
customer = {
    "full_name": "Amina Alami",
    "phone": "+212661234567",
    "city": "Casablanca",
    "address": "12 Boulevard Mohammed V, Apt 4",
    "email": "amina.alami@test.ma",
    "notes": "Sonner à l'interphone Alami"
}
items = [
    {
        "product_id": product["id"],
        "variant_id": None,
        "quantity": 1
    }
]
idempotency_key = str(uuid.uuid4())
fingerprint = hashlib.sha256(json.dumps({"customer": customer, "items": items}, sort_keys=True).encode()).hexdigest()
token = str(uuid.uuid4())
token_hash = hashlib.sha256(token.encode()).hexdigest()

payload = {
    "p_customer": customer,
    "p_items": items,
    "p_idempotency_key": idempotency_key,
    "p_fingerprint": fingerprint,
    "p_token_hash": token_hash
}

req_rpc = urllib.request.Request(
    f"{SUPABASE_URL}/rest/v1/rpc/create_guest_order",
    data=json.dumps(payload).encode('utf-8'),
    headers=headers,
    method="POST"
)

try:
    with urllib.request.urlopen(req_rpc) as resp:
        result = json.loads(resp.read().decode('utf-8'))
        print("ORDER CREATED SUCCESSFULLY!")
        print("Result:", result)
        order_code = result.get("code")
except urllib.error.HTTPError as e:
    print(f"Error {e.code}: {e.read().decode('utf-8')}")
    exit(1)

# 3. Verify order in orders table
req_order = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/orders?public_order_code=eq.{order_code}&select=*,order_items(*)", headers=headers)
with urllib.request.urlopen(req_order) as resp:
    orders = json.loads(resp.read().decode('utf-8'))
    print("Retrieved Order:", json.dumps(orders, indent=2))
