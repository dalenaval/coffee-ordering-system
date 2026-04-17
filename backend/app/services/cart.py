from app.models.cart import Cart

def format_cart(cart:Cart)->dict:
    cart_items = []

    for cart_item in cart.items:
        product = cart_item.product

        options = []

        for item in cart_item.cart_options:
            options.append({
                'id':item.option_item_id,
                'name': item.option_name,
                'price_modifier':item.option_price,
            }) 
        
        option_total = sum(float(option.get("price_modifier", 0)) for option in options)

        base_price = (float(product.price) + option_total)


        cart_items.append({
                'id':cart_item.cart_id,
                'product_id': product.id,
                'quantity':cart_item.quantity,
                'product_name': product.name,
                'cart_item_id':cart_item.id,
                'product_image': product.image_url,
                'unit_price': product.price,
                'base_price':base_price,
                'line_total':cart_item.total_price,
                'options':options

        })

    total_price = sum(float(cart_list.get('line_total', 0))  for cart_list in cart_items)
    
    return {
        "items": cart_items,
        "total_price":total_price
    }