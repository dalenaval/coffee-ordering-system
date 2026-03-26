import Footer from "@/components/layout/Footer";
import "./HomePage.css";
import Header from "@/components/layout/Header";
import ProductCatalog from "@/components/ui/productCatalog";

const HomePage = () => {
  const cartBadgeCount = 3; // Example cart item count, replace with actual state or props

  return (
    <div className="container">
      <Header
        onCartClick={() => console.log("Cart clicked")}
        cartItemCount={cartBadgeCount}
        showCart
      />
      <main className="main-content">
        <div className="hero-section">
          <h1>Welcome to Kape Nga Ni</h1>
          <p>Discover your perfect brew</p>
        </div>

        <ProductCatalog onCustomize={() => console.log("Product customized")} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
