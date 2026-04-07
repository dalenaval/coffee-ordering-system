import sys
import os
import uuid6
from sqlalchemy import delete
from sqlalchemy.sql import text

# Add the parent directory to sys.path so 'app' is recognized
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.db.session import SessionLocal
from app.models.category import Category
from app.models.product import Product

def clean_db(db):
    print("Cleaning up old data... (Products first, then Categories)")
    # Using execute(delete(...)) is correct for SQLAlchemy 2.0
    db.execute(delete(Product))
    db.execute(delete(Category))
    db.commit()

def run_seed():
    db = SessionLocal()
    try:
        # 1. ALWAYS clean first if you want a fresh start
        clean_db(db)

        print("\nSeeding Categories...")
        categories_list = [
            'coffee', 'non-coffee', 'tea', 'milktea', 'frappe', 'pastry', 'meal', 'other'
        ]
        
        category_map = {}

        for name in categories_list:
            # We use name.capitalize() or similar if you want pretty names in the DB
            cat = Category(name=name)
            db.add(cat)
            db.flush()  # Populates cat.id
            category_map[name] = cat
            print(f"  + Added category: {name}")

        print("\nSeeding Sample Products...")
        products_to_seed = [
            {
                "name": "Spanish Latte", 
                "price": 145.00, 
                "cat": "coffee",
                "desc": "A creamy, sweetened espresso-based drink made with condensed milk and steamed fresh milk."
            },
            {
                "name": "Blueberry Cheesecake", 
                "price": 180.00, 
                "cat": "pastry",
                "desc": "Rich and velvety cheesecake topped with a thick layer of sweet-tart blueberry compote."
            },
            {
                "name": "Porksilog", 
                "price": 165.00, 
                "cat": "meal",
                "desc": "A Filipino breakfast favorite: tender fried pork chop served with garlic fried rice and a sunny-side-up egg."
            },
            {
                "name": "Matcha Berry Latte", 
                "price": 160.00, 
                "cat": "non-coffee",
                "desc": "Premium Uji matcha layered with fresh strawberry puree and cold milk. A refreshing non-caffeine alternative."
            },
            {
                "name": "Dark Chocolate Cocoa", 
                "price": 130.00, 
                "cat": "non-coffee",
                "desc": "Rich, artisanal dark chocolate melted into steamed milk for a comforting, caffeine-free treat."
            },
            {
                "name": "Classic Croissant", 
                "price": 95.00, 
                "cat": "pastry",
                "desc": "Buttery, flaky, and golden-brown French pastry baked fresh daily."
            }
        ]

        for product in products_to_seed:
            new_product = Product(
                id=uuid6.uuid7(),
                name=product["name"],
                description=product["desc"],
                price=product["price"],
                category_id=category_map[product["cat"]].id,
                is_available=True
            )
            db.add(new_product)
            print(f"  + Added product: {product['name']}")

        db.commit()
        print(f"\nDatabase is now ready for testing!")

    except Exception as error:
        print(f" Critical Error: {error}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()