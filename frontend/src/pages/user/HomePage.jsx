"use-client";

import { useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProductModal from "@/components/ui/ProductModal";
import ProductCatalog from "@/components/ui/productCatalog";
import Cart from "@/components/ui/Cart";
import "./HomePage.css";
import CheckoutForm from "@/components/ui/CheckoutForm";

const HomePage = () => {
  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleAddToCart = (cartItem) => {
    setCartItems((prev) => [...prev, cartItem]);
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(index);
      return;
    }

    setCartItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const pricePerUnit = item.totalPrice / item.quantity;
      updated[index] = {
        ...item,
        quantity: newQuantity,
        totalPrice: pricePerUnit * newQuantity,
      };
      return updated;
    });
  };
  const handleRemoveItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (order) => {
    console.log("order:", order);
    setIsCheckoutOpen(false);
    setCartItems([]);
  };

  return (
    <div className="container">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={cartItems.length}
        showCart
      />
      <main className="main-content">
        <div className="hero-section">
          <h1>Welcome to Kape Nga Ni</h1>
          <p>Discover your perfect brew</p>
        </div>

        <ProductCatalog onCustomize={(product) => setProduct(product)} />
      </main>
      {product && (
        <ProductModal
          product={product}
          onClose={() => setProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
      {isCheckoutOpen && (
        <CheckoutForm
          cartItems={cartItems}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={handleOrderComplete}
        />
      )}
      <Footer />
    </div>
  );
};

export default HomePage;
