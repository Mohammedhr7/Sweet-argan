import base64

def id_to_shortcode(media_id):
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    shortcode = ''
    media_id = int(media_id)
    while media_id > 0:
        remainder = media_id % 64
        media_id //= 64
        shortcode = alphabet[remainder] + shortcode
    return shortcode

# Test with known shortcode
# DKe2ZO0tVdK: in item 0, ig_cache_key was MzY0NzU5MTk3NjYzMTg4MzU5NA%3D%3D
# Let's decode base64 MzY0NzU5MTk3NjYzMTg4MzU5NA==
s = base64.b64decode('MzY0NzU5MTk3NjYzMTg4MzU5NA==').decode()
print("Decoded media id:", s)
print("Converted to shortcode:", id_to_shortcode(s))
