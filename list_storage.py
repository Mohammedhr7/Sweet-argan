import urllib.request
import json

SUPABASE_URL = "https://wpcqqpzkavciiugwvqsn.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwY3FxcHprYXZjaWl1Z3d2cXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDM0NDE5MywiZXhwIjoyMTA1OTIwMTkzfQ.f_Om_il7HKq6ZrRtgaYKT8VtVj6vnU8oOFi57sXi6_0"

def list_bucket_files(bucket):
    url = f"{SUPABASE_URL}/storage/v1/object/list/{bucket}"
    req = urllib.request.Request(url, headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json"
    }, data=json.dumps({"prefix": "", "limit": 100}).encode('utf-8'))
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return f"Error: {e}"

print("Products bucket files:", list_bucket_files("products"))
print("Categories bucket files:", list_bucket_files("categories"))
print("Site-content bucket files:", list_bucket_files("site-content"))
