import urllib.request
import json
import ssl

SUPABASE_URL = "https://wpcqqpzkavciiugwvqsn.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwY3FxcHprYXZjaWl1Z3d2cXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDM0NDE5MywiZXhwIjoyMTA1OTIwMTkzfQ.f_Om_il7HKq6ZrRtgaYKT8VtVj6vnU8oOFi57sXi6_0"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

def query_table(table, select="*"):
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return f"Error: {e}"

def list_buckets():
    url = f"{SUPABASE_URL}/storage/v1/bucket"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return f"Error: {e}"

print("Categories:", query_table("categories"))
print("Products:", query_table("products", "id,name,slug,status,is_active,price,category_id"))
print("Product Images:", query_table("product_images"))
print("Settings:", query_table("settings"))
print("Storage Buckets:", list_buckets())
