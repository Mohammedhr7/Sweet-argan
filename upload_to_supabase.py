import os
import glob
import urllib.request
import mimetypes

SUPABASE_URL = "https://wpcqqpzkavciiugwvqsn.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwY3FxcHprYXZjaWl1Z3d2cXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDM0NDE5MywiZXhwIjoyMTA1OTIwMTkzfQ.f_Om_il7HKq6ZrRtgaYKT8VtVj6vnU8oOFi57sXi6_0"

base_dir = r"C:\Users\mohap\Documents\Codex\2026-10-02\create-the-initial-folder-architecture-for\outputs\ecommerce-project\final_visuals"

def upload_file(bucket, local_file):
    filename = os.path.basename(local_file)
    url = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{filename}"
    
    with open(local_file, "rb") as f:
        file_bytes = f.read()
        
    mime = "image/jpeg"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": mime,
        "x-upsert": "true"
    }
    
    req = urllib.request.Request(url, data=file_bytes, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"Uploaded to {bucket}/{filename}: status {resp.status}")
            return True
    except urllib.error.HTTPError as e:
        # If already exists or error, try PUT for update
        if e.code in (400, 409):
            try:
                req_put = urllib.request.Request(url, data=file_bytes, headers=headers, method="PUT")
                with urllib.request.urlopen(req_put) as resp2:
                    print(f"Updated (PUT) {bucket}/{filename}: status {resp2.status}")
                    return True
            except Exception as e2:
                print(f"Error PUT {bucket}/{filename}: {e2}")
        else:
            print(f"Error POST {bucket}/{filename}: {e.code} {e.read().decode('utf-8', errors='ignore')}")
    except Exception as e:
        print(f"General error {bucket}/{filename}: {e}")
    return False

buckets = ["products", "categories", "site-content"]

for b in buckets:
    folder = os.path.join(base_dir, b)
    for f in sorted(glob.glob(os.path.join(folder, "*.*"))):
        upload_file(b, f)

print("UPLOAD FINISHED!")
