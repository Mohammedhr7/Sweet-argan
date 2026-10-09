import urllib.request
import json
import uuid

SUPABASE_URL = "https://wpcqqpzkavciiugwvqsn.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwY3FxcHprYXZjaWl1Z3d2cXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDM0NDE5MywiZXhwIjoyMTA1OTIwMTkzfQ.f_Om_il7HKq6ZrRtgaYKT8VtVj6vnU8oOFi57sXi6_0"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation,resolution=merge-duplicates"
}

def post(endpoint, data):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"Error {endpoint}: {e.code} - {e.read().decode('utf-8')}")
        return None

def patch(endpoint, query, data):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}?{query}"
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method="PATCH")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"Error PATCH {endpoint}: {e.code} - {e.read().decode('utf-8')}")
        return None

def get(endpoint, query=""):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}" + (f"?{query}" if query else "")
    req = urllib.request.Request(url, headers={"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"})
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"Error GET {endpoint}: {e}")
        return []

# 1. Categories
categories_data = [
    {
        "name": "Soins du visage",
        "slug": "soins-du-visage",
        "description": "Crèmes précieuses et formules botaniques à base d'huile d'argan et de figue de barbarie pour sublimer l'éclat de votre peau.",
        "image_url": f"{SUPABASE_URL}/storage/v1/object/public/categories/soins-du-visage.jpg",
        "is_active": True,
        "sort_order": 1
    },
    {
        "name": "Soins du corps",
        "slug": "soins-du-corps",
        "description": "Déodorants solides naturels sans alcool, délices de hammam et soins corporels quotidiens pour une fraîcheur protectrice.",
        "image_url": f"{SUPABASE_URL}/storage/v1/object/public/categories/soins-du-corps.jpg",
        "is_active": True,
        "sort_order": 2
    },
    {
        "name": "Savons",
        "slug": "savons",
        "description": "Savons artisanaux 100% naturels pour nettoyer, détoxifier et respecter l'équilibre naturel de votre épiderme.",
        "image_url": f"{SUPABASE_URL}/storage/v1/object/public/categories/savons.jpg",
        "is_active": True,
        "sort_order": 3
    },
    {
        "name": "Masques & Argiles",
        "slug": "masques-et-soins",
        "description": "Argiles naturelles pures et masques traditionnels marocains pour un rituel de soin digne des plus grands spas.",
        "image_url": f"{SUPABASE_URL}/storage/v1/object/public/categories/masques-et-soins.jpg",
        "is_active": True,
        "sort_order": 4
    },
    {
        "name": "Huiles & Solaires",
        "slug": "huiles-et-solaires",
        "description": "Huiles précieuses et formules solaires satinées à l'argan biologique pour un bronzage doré lumineux et durable.",
        "image_url": f"{SUPABASE_URL}/storage/v1/object/public/categories/huiles-et-solaires.jpg",
        "is_active": True,
        "sort_order": 5
    },
    {
        "name": "Terroir marocain",
        "slug": "terroir-marocain",
        "description": "L'authenticité gastronomique marocaine : huile d'argan alimentaire torréfiée et Amlou artisanal aux amandes et miel pur.",
        "image_url": f"{SUPABASE_URL}/storage/v1/object/public/categories/terroir-marocain.jpg",
        "is_active": True,
        "sort_order": 6
    },
    {
        "name": "Coffrets",
        "slug": "coffrets",
        "description": "Compositions complètes et coffrets rituels associant soins cosmétiques et délices du terroir Sweet Argan.",
        "image_url": f"{SUPABASE_URL}/storage/v1/object/public/categories/coffrets.jpg",
        "is_active": True,
        "sort_order": 7
    }
]

print("Upserting categories...")
# Delete or update existing categories
existing_cats = {c['slug']: c for c in get("categories")}
cat_id_map = {}

for cat in categories_data:
    slug = cat['slug']
    if slug in existing_cats:
        cid = existing_cats[slug]['id']
        patch("categories", f"id=eq.{cid}", cat)
        cat_id_map[slug] = cid
        print(f"Updated category: {cat['name']} ({cid})")
    else:
        # Check if old slugs exist
        old_slug_map = {"huiles-de-soin": "huiles-et-solaires"}
        found_old = False
        for old_slug, new_slug in old_slug_map.items():
            if new_slug == slug and old_slug in existing_cats:
                cid = existing_cats[old_slug]['id']
                patch("categories", f"id=eq.{cid}", cat)
                cat_id_map[slug] = cid
                found_old = True
                print(f"Renamed and updated category: {cat['name']} ({cid})")
                break
        if not found_old:
            res = post("categories", [cat])
            if res:
                cat_id_map[slug] = res[0]['id']
                print(f"Inserted category: {cat['name']}")

# Fetch updated categories
all_cats = {c['slug']: c['id'] for c in get("categories")}
print("Categories map:", all_cats)

# 2. Products Definition
products_def = [
    # Active 1
    {
        "name": "Pack Timomouchin",
        "slug": "pack-timomouchin",
        "category_slug": "coffrets",
        "price": 500.0,
        "compare_at_price": 580.0,
        "stock_quantity": 15,
        "track_inventory": True,
        "status": "active",
        "is_active": True,
        "is_featured": True,
        "is_best_seller": True,
        "short_description": "Coffret signature prestige : Huile d'argan culinaire, Amlou aux amandes, Crème d'argan et Savon de charbon.",
        "description": "Le Pack Timomouchin réunit le meilleur du terroir et de la beauté marocaine dans un coffret raffiné. Composé d'une bouteille d'huile d'argan alimentaire pure torréfiée, d'un bocal d'amlou d'amandes au miel, d'un pot de crème d'argan nutritive et d'un pain de savon de charbon détoxifiant. Présenté dans un élégant coffret kraft orné de son ruban olive Sweet Argan.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/reel/DDhM5N3t8bJ/",
        "image_file": "pack-timomouchin.jpg"
    },
    # Active 2
    {
        "name": "Crème d'Argan",
        "slug": "creme-d-argan",
        "category_slug": "soins-du-visage",
        "price": 120.0,
        "compare_at_price": None,
        "stock_quantity": 25,
        "track_inventory": True,
        "status": "active",
        "is_active": True,
        "is_featured": True,
        "is_best_seller": True,
        "short_description": "Crème visage nutritive et adoucissante enrichie à l'huile d'argan pure de la coopérative.",
        "description": "Formulée à partir de l'huile d'argan biologique de notre coopérative, la Crème d'Argan apporte douceur et souplesse à l'épiderme. Sa texture onctueuse pénètre facilement pour nourrir en profondeur et préserver le confort naturel de la peau au quotidien.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DKe2ZO0tVdK/",
        "image_file": "creme-argan.jpg"
    },
    # Active 3
    {
        "name": "Crème de Figue de Barbarie",
        "slug": "creme-de-figue-de-barbarie",
        "category_slug": "soins-du-visage",
        "price": 150.0,
        "compare_at_price": 180.0,
        "stock_quantity": 20,
        "track_inventory": True,
        "status": "active",
        "is_active": True,
        "is_featured": True,
        "is_best_seller": False,
        "short_description": "Soin visage revitalisant et protecteur aux extraits de graines de figue de barbarie.",
        "description": "La Crème de Figue de Barbarie Sweet Argan puise ses vertus dans les graines du figuier de Barbarie, trésor anti-âge des terres arides marocaines. Idéale pour tous types de peaux, elle participe à lisser les ridules et protéger la peau contre la fatigue cutanée.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DKe2ZO0tVdK/",
        "image_file": "creme-figue-barbarie.jpg"
    },
    # Active 4
    {
        "name": "Crème Royale OUD",
        "slug": "creme-royale-oud",
        "category_slug": "soins-du-visage",
        "price": 180.0,
        "compare_at_price": None,
        "stock_quantity": 18,
        "track_inventory": True,
        "status": "active",
        "is_active": True,
        "is_featured": True,
        "is_best_seller": True,
        "short_description": "Soin précieux d'exception infusé au parfum envoûtant de bois d'oud oriental.",
        "description": "Véritable alliance entre la noblesse de l'oud et la richesse de l'argan marocain, la Crème Royale OUD offre une expérience sensorielle luxueuse. Sa formule généreuse sublime la texture de la peau en laissant un sillage boisé captivant.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DKe2ZO0tVdK/",
        "image_file": "creme-royale-oud.jpg"
    },
    # Active 5
    {
        "name": "Savon de Charbon",
        "slug": "savon-de-charbon",
        "category_slug": "savons",
        "price": 45.0,
        "compare_at_price": None,
        "stock_quantity": 40,
        "track_inventory": True,
        "status": "active",
        "is_active": True,
        "is_featured": False,
        "is_best_seller": True,
        "short_description": "Pain de savon détoxifiant 100% naturel au charbon végétal actif et argan.",
        "description": "Le Savon de Charbon Sweet Argan nettoie les impuretés en profondeur sans assécher. Formulé pour absorber l'excès de sébum et purifier les pores, il est particulièrement recommandé pour les peaux mixtes à grasses en quête de netteté naturelle.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DKe10LLtx4d/",
        "image_file": "savon-charbon.jpg"
    },
    # Active 6
    {
        "name": "Déodorant Roll-on Musc",
        "slug": "deodorant-musc",
        "category_slug": "soins-du-corps",
        "price": 65.0,
        "compare_at_price": None,
        "stock_quantity": 30,
        "track_inventory": True,
        "status": "active",
        "is_active": True,
        "is_featured": False,
        "is_best_seller": False,
        "short_description": "Déodorant bille 48h sans alcool au parfum frais et poudré de musc blanc.",
        "description": "Spécialement développé pour le respect des peaux sensibles, le Déodorant Musc Sweet Argan assure une protection naturelle contre la transpiration jusqu'à 48 heures. Sans alcool et enrichi en agents adoucissants, il procure une sensation de fraîcheur continue.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DKe1fyaNNY1/",
        "image_file": "deodorant-musc.jpg"
    },
    # Active 7
    {
        "name": "Huile de Bronzage",
        "slug": "huile-de-bronzage",
        "category_slug": "huiles-et-solaires",
        "price": 130.0,
        "compare_at_price": None,
        "stock_quantity": 25,
        "track_inventory": True,
        "status": "active",
        "is_active": True,
        "is_featured": True,
        "is_best_seller": False,
        "short_description": "Huile satinée bronzante 100ml enrichie à l'argan biologique pour un hâle doré sublime.",
        "description": "L'Huile de Bronzage Sweet Argan favorise un bronzage lumineux, harmonieux et longue durée tout en nourrissant intensément l'épiderme sous le soleil. Son fini sec et satiné ne colle pas et enveloppe le corps d'une délicate touche dorée.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DDXmoQzNoOs/",
        "image_file": "huile-bronzage.jpg"
    },
    # Active 8
    {
        "name": "Argile Verte Naturelle",
        "slug": "argile-verte-naturelle",
        "category_slug": "masques-et-soins",
        "price": 55.0,
        "compare_at_price": None,
        "stock_quantity": 30,
        "track_inventory": True,
        "status": "active",
        "is_active": True,
        "is_featured": False,
        "is_best_seller": False,
        "short_description": "Poudre d'argile verte 100% pure pour masque visage purifiant et équilibrant.",
        "description": "Extraite des carrières naturelles marocaines, l'Argile Verte Sweet Argan est le soin par excellence des peaux mixtes et grasses. Elle resserre les pores, absorbe le sébum et redonne fraîcheur et pureté au teint.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DKe18wMN3zV/",
        "image_file": "argile-verte.jpg"
    },
    # Active 9
    {
        "name": "Amlou Artisanal aux Amandes & Miel",
        "slug": "amlou-artisanal-amandes-miel",
        "category_slug": "terroir-marocain",
        "price": 110.0,
        "compare_at_price": None,
        "stock_quantity": 25,
        "track_inventory": True,
        "status": "active",
        "is_active": True,
        "is_featured": False,
        "is_best_seller": True,
        "short_description": "Pâte à tartiner traditionnelle berbère aux amandes torréfiées, miel pur et huile d'argan.",
        "description": "Préparé selon la recette ancestrale du Souss, notre Amlou Sweet Argan réunit des amandes douces finement moulues à la meule de pierre, du miel pur d'eucalyptus et notre huile d'argan torréfiée. Un trésor gustatif riche en énergie et en goût.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/reel/DDhM5N3t8bJ/",
        "image_file": "amlou-amandes-miel.jpg"
    },
    # Draft 10
    {
        "name": "Déodorant Roll-on Oud",
        "slug": "deodorant-oud",
        "category_slug": "soins-du-corps",
        "price": 0.0,
        "compare_at_price": None,
        "stock_quantity": 0,
        "track_inventory": True,
        "status": "draft",
        "is_active": False,
        "is_featured": False,
        "is_best_seller": False,
        "short_description": "Déodorant bille 48h sans alcool au parfum chaleureux de bois d'oud.",
        "description": "Déodorant bille naturel Sweet Argan formulé pour les peaux sensibles, au parfum noble et boisé d'oud oriental.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DKe1NS5ttM1/",
        "image_file": "deodorant-oud.jpg"
    },
    # Draft 11
    {
        "name": "Tebrima aux 20 Plantes",
        "slug": "tebrima-aux-20-plantes",
        "category_slug": "soins-du-corps",
        "price": 0.0,
        "compare_at_price": None,
        "stock_quantity": 0,
        "track_inventory": True,
        "status": "draft",
        "is_active": False,
        "is_featured": False,
        "is_best_seller": False,
        "short_description": "Gommage traditionnel aux 20 herbes aromatiques pour le rituel du hammam marocain (100g).",
        "description": "Mélange traditionnel de 20 plantes médicinales et aromatiques marocaines spécialement sélectionnées pour exfolier, adoucir et illuminer la peau lors du rituel du hammam.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DKe18wMN3zV/",
        "image_file": "tebrima-20-plantes.jpg"
    },
    # Draft 12
    {
        "name": "Argile Rouge Naturelle",
        "slug": "argile-rouge-naturelle",
        "category_slug": "masques-et-soins",
        "price": 0.0,
        "compare_at_price": None,
        "stock_quantity": 0,
        "track_inventory": True,
        "status": "draft",
        "is_active": False,
        "is_featured": False,
        "is_best_seller": False,
        "short_description": "Argile rouge douce 100% pure pour peaux normales et sensibles en manque d'éclat.",
        "description": "Riche en oligo-éléments et en oxyde de fer, l'Argile Rouge Sweet Argan réveille les teints ternes et fatigués tout en respectant la fragilité des peaux sensibles.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/p/DKe18wMN3zV/",
        "image_file": "argile-rouge.jpg"
    },
    # Draft 13
    {
        "name": "Huile d'Argan Alimentaire Pure",
        "slug": "huile-d-argan-alimentaire-pure",
        "category_slug": "terroir-marocain",
        "price": 0.0,
        "compare_at_price": None,
        "stock_quantity": 0,
        "track_inventory": True,
        "status": "draft",
        "is_active": False,
        "is_featured": False,
        "is_best_seller": False,
        "short_description": "Huile d'argan alimentaire vierge de première pression à froid torréfiée au goût praliné unique.",
        "description": "Extraite à froid à partir d'amandons d'argan légèrement torréfiés par les artisanes de la coopérative Sweet Argan, cette huile alimentaire vierge sublime vos salades, poissons et mets traditionnels.",
        "source_type": "instagram",
        "source_url": "https://www.instagram.com/reel/DDhM5N3t8bJ/",
        "image_file": "huile-argan-alimentaire.jpg"
    }
]

print("Importing products...")
existing_prods = {p['slug']: p for p in get("products")}

for p_data in products_def:
    slug = p_data['slug']
    cat_slug = p_data['category_slug']
    cat_id = all_cats.get(cat_slug)
    
    prod_row = {
        "name": p_data['name'],
        "slug": p_data['slug'],
        "category_id": cat_id,
        "price": p_data['price'],
        "compare_at_price": p_data['compare_at_price'],
        "stock_quantity": p_data['stock_quantity'],
        "track_inventory": p_data['track_inventory'],
        "status": p_data['status'],
        "is_active": p_data['is_active'],
        "is_featured": p_data['is_featured'],
        "is_best_seller": p_data['is_best_seller'],
        "short_description": p_data['short_description'],
        "description": p_data['description'],
        "source_type": p_data['source_type'],
        "source_url": p_data['source_url']
    }
    
    image_url = f"{SUPABASE_URL}/storage/v1/object/public/products/{p_data['image_file']}"
    
    if slug in existing_prods:
        pid = existing_prods[slug]['id']
        patch("products", f"id=eq.{pid}", prod_row)
        print(f"Updated product: {p_data['name']} ({p_data['status']})")
    else:
        res = post("products", [prod_row])
        if res:
            pid = res[0]['id']
            print(f"Inserted product: {p_data['name']} ({p_data['status']})")
        else:
            continue
            
    # Product Image
    # Check if image exists
    existing_imgs = get("product_images", f"product_id=eq.{pid}")
    if existing_imgs:
        patch("product_images", f"product_id=eq.{pid}", {
            "image_url": image_url,
            "alt_text": f"{p_data['name']} Sweet Argan",
            "sort_order": 0
        })
    else:
        post("product_images", [{
            "product_id": pid,
            "image_url": image_url,
            "alt_text": f"{p_data['name']} Sweet Argan",
            "sort_order": 0
        }])

# 3. Settings update
print("Updating settings...")
shipping_val = {
    "amount": 35,
    "free_threshold": 300,
    "enabled": True
}
patch("settings", "key=eq.shipping", {"value": shipping_val})

site_content_val = {
    "announcement": "Sweet Argan · Coopérative marocaine d'Agadir · Livraison dans tout le Maroc",
    "hero_title": "L'or du Maroc, sublimé au creux de votre main.",
    "hero_subtitle": "Découvrez nos soins purs à l'huile d'argan biologique, délices de hammam et trésors authentiques du terroir marocain.",
    "hero_cta": "Découvrir la collection",
    "hero_cta_href": "/shop",
    "hero_image": f"{SUPABASE_URL}/storage/v1/object/public/site-content/home-hero.jpg",
    "promo_title": "Un rituel d'exception hérité des traditions du Souss.",
    "promo_text": "Chaque soin Sweet Argan est né d'un savoir-faire coopératif rigoureux. Nous récoltons et pressons l'argan avec respect pour offrir une pureté incomparable.",
    "promo_image": f"{SUPABASE_URL}/storage/v1/object/public/site-content/about-story.jpg",
    "terms_text": "Conditions générales de vente de la coopérative Sweet Argan. Paiement à la livraison en espèces partout au Maroc. Retours acceptés sous 7 jours pour les produits non ouverts.",
    "privacy_text": "Vos données personnelles (nom, adresse, téléphone) sont utilisées uniquement pour le traitement et la livraison de votre commande. Aucune donnée n'est cédée à des tiers.",
    "shipping_text": "Livraison sécurisée sous 24 à 48h dans toutes les villes du Maroc (Casablanca, Rabat, Marrakech, Agadir, Tanger, Fès, Meknès, etc.). Tarif unique de 35 MAD, offerte dès 300 MAD d'achat.",
    "footer_text": "Coopérative Agricole Sweet Argan · Huile d'Argan, Soins & Terroir marocain.",
    "instagram": "https://www.instagram.com/sweet_argan/",
    "whatsapp": "+212661983329",
    "contact_email": "contact@sweetargan.ma",
    "testimonials": [
        {
            "name": "Fatima-Zahra, Casablanca",
            "quote": "La crème d'argan et le savon au charbon ont complètement transformé ma peau. Un vrai rituel de douceur !"
        },
        {
            "name": "Yassine, Rabat",
            "quote": "Pack Timomouchin reçu en 24h avec paiement à la livraison. L'amlou et l'huile sont exceptionnels."
        },
        {
            "name": "Khadija, Marrakech",
            "quote": "Le déodorant au musc et l'huile de bronzage sentent divinement bon. Produits 100% naturels et authentiques."
        }
    ]
}
patch("settings", "key=eq.site_content", {"value": site_content_val})

print("ALL SUPABASE DATA CONFIGURED SUCCESSFULLY!")
