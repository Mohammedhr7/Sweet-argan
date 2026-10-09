import os
from PIL import Image, ImageDraw, ImageFilter

base_dir = r"C:\Users\mohap\Documents\Codex\2026-10-02\create-the-initial-folder-architecture-for\outputs\ecommerce-project\final_visuals"
prod_dir = os.path.join(base_dir, "products")
cat_dir = os.path.join(base_dir, "categories")
site_dir = os.path.join(base_dir, "site-content")

def make_seamless_banner(src_img_path, dest_path, width=1200, height=750, feather=60, scale=0.88):
    im = Image.open(src_img_path)
    # Average the border pixels to get the exact background color
    corners = [
        im.getpixel((5, 5)),
        im.getpixel((im.width - 6, 5)),
        im.getpixel((5, im.height - 6)),
        im.getpixel((im.width - 6, im.height - 6))
    ]
    avg_bg = (
        sum(c[0] for c in corners) // 4,
        sum(c[1] for c in corners) // 4,
        sum(c[2] for c in corners) // 4
    )
    
    canvas = Image.new("RGB", (width, height), avg_bg)
    
    # Scale image so it fits within height * scale
    target_h = int(height * scale)
    target_w = int(im.width * (target_h / im.height))
    if target_w > width:
        target_w = int(width * scale)
        target_h = int(im.height * (target_w / im.width))
        
    im_resized = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Create mask with smooth feather at borders
    mask = Image.new("L", (target_w, target_h), 255)
    draw = ImageDraw.Draw(mask)
    f = min(feather, target_w // 4, target_h // 4)
    for i in range(f):
        alpha = int(255 * (i / f))
        draw.rectangle([i, i, target_w - 1 - i, target_h - 1 - i], outline=alpha)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=f // 3))
    
    x = (width - target_w) // 2
    y = (height - target_h) // 2
    canvas.paste(im_resized, (x, y), mask)
    canvas.save(dest_path, "JPEG", quality=92, optimize=True)
    print(f"Generated seamless banner: {os.path.basename(dest_path)}")

# 1. Category banners (1200x700)
cat_map = {
    "soins-du-visage.jpg": "creme-figue-barbarie.jpg",
    "soins-du-corps.jpg": "deodorant-musc.jpg",
    "savons.jpg": "savon-charbon.jpg",
    "masques-et-soins.jpg": "argile-verte.jpg",
    "huiles-et-solaires.jpg": "huile-bronzage.jpg",
    "terroir-marocain.jpg": "amlou-amandes-miel.jpg",
    "coffrets.jpg": "pack-timomouchin.jpg"
}

for cat_file, prod_file in cat_map.items():
    src = os.path.join(prod_dir, prod_file)
    dst = os.path.join(cat_dir, cat_file)
    make_seamless_banner(src, dst, width=1200, height=680, feather=70, scale=0.92)

# 2. Site Content banners
# Home Hero: 1600x900 wide
make_seamless_banner(os.path.join(prod_dir, "pack-timomouchin.jpg"), os.path.join(site_dir, "home-hero.jpg"), width=1600, height=900, feather=80, scale=0.95)

# Skincare section: 1200x800
make_seamless_banner(os.path.join(prod_dir, "creme-argan.jpg"), os.path.join(site_dir, "home-skincare.jpg"), width=1200, height=800, feather=75, scale=0.90)

# Haircare & Hammam ritual section: 1200x800
make_seamless_banner(os.path.join(prod_dir, "tebrima-20-plantes.jpg"), os.path.join(site_dir, "home-haircare.jpg"), width=1200, height=800, feather=75, scale=0.90)

# Terroir section: 1200x800
make_seamless_banner(os.path.join(prod_dir, "huile-argan-alimentaire.jpg"), os.path.join(site_dir, "home-terroir.jpg"), width=1200, height=800, feather=75, scale=0.90)

# Gift / collection: 1200x800
make_seamless_banner(os.path.join(prod_dir, "pack-timomouchin.jpg"), os.path.join(site_dir, "home-gift.jpg"), width=1200, height=800, feather=75, scale=0.90)

# About Story: 1200x800
make_seamless_banner(os.path.join(prod_dir, "creme-royale-oud.jpg"), os.path.join(site_dir, "about-story.jpg"), width=1200, height=800, feather=75, scale=0.90)

print("ALL SEAMLESS VISUALS GENERATED!")
