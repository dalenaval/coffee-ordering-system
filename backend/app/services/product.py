from app.models.product import Product

def format_product(product:Product) -> dict:
    groups = []
    seen_group_ids = set()

    for product_atrributes in product.product_attributes:
        group = product_atrributes.option_group

        if group.deleted_at:
            continue
        
        if group.id in seen_group_ids:
            continue

        items = []

        for item in group.items:
             if item.deleted_at is not None:
                 continue
             
             items.append({
                "id": item.id,
                "name":item.name,
                "price_modifier": float(item.price_modifier or 0),
                "display_order": item.display_order
                
             })

             items.sort(key=lambda x: x['display_order'] or 0)
             
        groups.append({
                "id": group.id,
                "name": group.name,
                "max_count":group.max_count,
                "items": items
            })
            
        seen_group_ids.add(group.id)

    return {
        "id": product.id,
        "name": product.name,
        "description":product.description,
        "price": product.price,
        "option_group": groups
    }
    # return groups.append({
    #         "id": product.id,
    #         "name": product.name,
    #         "price": product.price,
    #         "options": groups
    #     })