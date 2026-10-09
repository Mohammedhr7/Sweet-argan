import os
import glob
from PIL import Image, ImageOps, ImageFilter, ImageDraw, ImageFont

brain_dir = r"C:\Users\mohap\.gemini\antigravity\brain\90147712-5ffb-4fe5-8352-c7cb3a909a70"
out_dir = r"C:\Users\mohap\Documents\Codex\2026-10-02\create-the-initial-folder-architecture-for\outputs\ecommerce-project\final_visuals"
os.makedirs(out_dir, exist_ok=True)
os.makedirs(os.path.join(out_dir, "products"), exist_ok=True)
os.makedirs(os.path.join(out_dir, "categories"), exist_ok=True)
os.makedirs(os.path.join(out_dir, "site-content"), exist_ok=True)

# 1. Product mapping
prod_images = {
    "creme-argan.jpg": "creme_argan_1791042012086.jpg",
    "creme-figue-barbarie.jpg": "creme_figue_1791042033049.jpg",
    "creme-royale-oud.jpg": "creme_oud_1791042057167.jpg",
    "savon-charbon.jpg": "savon_charbon_1791042081915.jpg",
    "deodorant-musc.jpg": "deodorant_musc_1791042106203.jpg",
    "deodorant-oud.jpg": "deodorant_oud_1791042127855.jpg",
    "huile-bronzage.jpg": "huile_bronzage_1791042152479.jpg",
    "tebrima-20-plantes.jpg": "tebrima_plantes_1791042180316.jpg",
    "argile-verte.jpg": "argile_verte_1791042205166.jpg",
    "argile-rouge.jpg": "argile_rouge_1791042233001.jpg",
    "huile-argan-alimentaire.jpg": "argan_alimentaire_1791042257657.jpg",
    "amlou-amandes-miel.jpg": "amlou_amandes_1791042283592.jpg",
    "pack-timomouchin.jpg": "pack_timomouchin_1791042315072.jpg",
}

for dest_name, src_name in prod_images.items():
    src_path = os.path.join(brain_dir, src_name)
    dest_path = os.path.join(out_dir, "products", dest_name)
    im = Image.open(src_path)
    im.save(dest_path, "JPEG", quality=92, optimize=True)
    print(f"Prepared product image: {dest_name}")

# Color palette:
BG_CREAM = (246, 242, 235)
BG_WARM_WHITE = (250, 248, 245)
BG_OLIVE_TINT = (241, 240, 232)
TEXT_DARK = (44, 43, 39)
TEXT_MUTED = (120, 115, 105)
GOLD_BORDER = (200, 175, 125)

def get_product_crop(name, zoom=1.0):
    src_path = os.path.join(brain_dir, prod_images[name])
    return Image.open(src_path)

# 2. Build Category Visuals (800x500 landscape)
categories_meta = {
    "soins-du-visage.jpg": ("creme-argan.jpg", "creme-figue-barbarie.jpg", "Soins du Visage"),
    "soins-du-corps.jpg": ("deodorant-musc.jpg", "tebrima-20-plantes.jpg", "Soins du Corps"),
    "savons.jpg": ("savon-charbon.jpg", None, "Savons Traditionnels"),
    "masques-et-soins.jpg": ("argile-verte.jpg", "argile-rouge.jpg", "Masques & Argiles"),
    "huiles-et-solaires.jpg": ("huile-bronzage.jpg", None, "Huiles & Soins Solaires"),
    "terroir-marocain.jpg": ("huile-argan-alimentaire.jpg", "amlou-amandes-miel.jpg", "Terroir & Argan Culinaire"),
    "coffrets.jpg": ("pack-timomouchin.jpg", None, "Coffrets & Cadeaux")
}

for cat_file, (p1, p2, cat_title) in categories_meta.items():
    canvas = Image.new("RGB", (960, 600), BG_CREAM)
    
    if p2 is None:
        # Single hero product centered
        im1 = get_product_crop(p1)
        # Resize to fit height ~480
        w, h = im1.size
        new_h = 500
        new_w = int(w * (new_h / h))
        im1_r = im1.resize((new_w, new_h), Image.Resampling.LANCZOS)
        x = (960 - new_w) // 2
        y = (600 - new_h) // 2
        canvas.paste(im1_r, (x, y))
    else:
        # Two products side by side with elegant overlap
        im1 = get_product_crop(p1)
        im2 = get_product_crop(p2)
        
        new_h = 440
        w1, h1 = im1.size
        w2, h2 = im2.size
        new_w1 = int(w1 * (new_h / h1))
        new_w2 = int(w2 * (new_h / h2))
        
        im1_r = im1.resize((new_w1, new_h), Image.Resampling.LANCZOS)
        im2_r = im2.resize((new_w2, new_h), Image.Resampling.LANCZOS)
        
        # Position with gentle overlap
        total_w = new_w1 + new_w2 - 60
        start_x = (960 - total_w) // 2
        
        canvas.paste(im1_r, (start_x, (600 - new_h) // 2))
        canvas.paste(im2_r, (start_x + new_w1 - 60, (600 - new_h) // 2))
        
    dest_path = os.path.join(out_dir, "categories", cat_file)
    canvas.save(dest_path, "JPEG", quality=90, optimize=True)
    print(f"Created category visual: {cat_file}")

# 3. Build Site Content Visuals (Hero, Editorial sections, About)
# Home Hero: 1600x900 wide panorama
hero_canvas = Image.new("RGB", (1600, 900), BG_CREAM)
# Arrange Pack Timomouchin on right, Crème Royale and Huile Bronzage
pack_im = get_product_crop("pack-timomouchin.jpg")
pack_w, pack_h = pack_im.size
pack_new_h = 750
pack_new_w = int(pack_w * (pack_new_h / pack_h))
pack_r = pack_im.resize((pack_new_w, pack_new_h), Image.Resampling.LANCZOS)
hero_canvas.paste(pack_r, (900, 75))

# Left side products
oud_im = get_product_crop("creme-royale-oud.jpg")
oud_new_h = 480
oud_w, oud_h = oud_im.size
oud_new_w = int(oud_w * (oud_new_h / oud_h))
oud_r = oud_im.resize((oud_new_w, oud_new_h), Image.Resampling.LANCZOS)
hero_canvas.paste(oud_r, (480, 260))

oil_im = get_product_crop("huile-argan-alimentaire.jpg")
oil_new_h = 620
oil_w, oil_h = oil_im.size
oil_new_w = int(oil_w * (oil_new_h / oil_h))
oil_r = oil_im.resize((oil_new_w, oil_new_h), Image.Resampling.LANCZOS)
hero_canvas.paste(oil_r, (150, 150))

hero_dest = os.path.join(out_dir, "site-content", "home-hero.jpg")
hero_canvas.save(hero_dest, "JPEG", quality=92, optimize=True)
print("Created site-content: home-hero.jpg")

# Skincare Section Visual: 1000x700
skincare_canvas = Image.new("RGB", (1000, 700), BG_WARM_WHITE)
c1 = get_product_crop("creme-argan.jpg").resize((420, 560), Image.Resampling.LANCZOS)
c2 = get_product_crop("creme-figue-barbarie.jpg").resize((420, 560), Image.Resampling.LANCZOS)
skincare_canvas.paste(c1, (100, 70))
skincare_canvas.paste(c2, (480, 70))
skincare_dest = os.path.join(out_dir, "site-content", "home-skincare.jpg")
skincare_canvas.save(skincare_dest, "JPEG", quality=90, optimize=True)
print("Created site-content: home-skincare.jpg")

# Haircare & Hammam Ritual: 1000x700
hammam_canvas = Image.new("RGB", (1000, 700), BG_OLIVE_TINT)
h1 = get_product_crop("tebrima-20-plantes.jpg").resize((400, 530), Image.Resampling.LANCZOS)
h2 = get_product_crop("argile-verte.jpg").resize((400, 530), Image.Resampling.LANCZOS)
hammam_canvas.paste(h1, (100, 85))
hammam_canvas.paste(h2, (500, 85))
hammam_dest = os.path.join(out_dir, "site-content", "home-haircare.jpg")
hammam_canvas.save(hammam_dest, "JPEG", quality=90, optimize=True)
print("Created site-content: home-haircare.jpg")

# Terroir & Gift Section: 1000x700
terroir_canvas = Image.new("RGB", (1000, 700), BG_CREAM)
t1 = get_product_crop("pack-timomouchin.jpg").resize((520, 690), Image.Resampling.LANCZOS)
t2 = get_product_crop("amlou-amandes-miel.jpg").resize((380, 510), Image.Resampling.LANCZOS)
terroir_canvas.paste(t1, (50, 5))
terroir_canvas.paste(t2, (550, 95))
terroir_dest = os.path.join(out_dir, "site-content", "home-gift.jpg")
terroir_canvas.save(terroir_dest, "JPEG", quality=90, optimize=True)
print("Created site-content: home-gift.jpg")

# About Story Visual: 1200x800
about_canvas = Image.new("RGB", (1200, 800), BG_CREAM)
a1 = get_product_crop("pack-timomouchin.jpg").resize((600, 800), Image.Resampling.LANCZOS)
a2 = get_product_crop("creme-argan.jpg").resize((450, 600), Image.Resampling.LANCZOS)
about_canvas.paste(a1, (600, 0))
about_canvas.paste(a2, (100, 100))
about_dest = os.path.join(out_dir, "site-content", "about-story.jpg")
about_canvas.save(about_dest, "JPEG", quality=90, optimize=True)
print("Created site-content: about-story.jpg")

print("ALL EDITORIAL VISUALS COMPLETED!")
