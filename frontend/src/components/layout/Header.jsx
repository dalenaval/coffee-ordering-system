import { ShoppingCart } from "lucide-react";
import "./Header.css";

const Header = ({
  title = "Kape Nga Ni",
  showCart = false,
  cartItemCount,
  onCartClick,
  children,
}) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">
          <h1>{title}</h1>
        </div>
        <div className="header-actions">
          {children}
          {showCart && (
            <button
              className="cart-button"
              onClick={onCartClick}
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="icon-md" aria-hidden="true" />
              <span className="cart-text">Cart</span>

              {cartItemCount > 0 && (
                <span className="cart-badge" aria-live="polite">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
