import { ShoppingCart, User2Icon } from 'lucide-react'
import './Header.css'
import { useUserStore } from '@/store/useUserStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useCart } from '@/utils/useCart'

const Header = ({ title = 'Kape Nga Ni', showCart = false, onCartClick, onProfileClick, children }) => {
  const user = useUserStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { cart } = useCart()

  const handleKeyDown = (callback) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      callback?.()
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">
          <h1>{title}</h1>
        </div>
        <div className="header-actions">
          {children}
          {showCart && (
            <div
              className="header-button"
              onClick={onCartClick}
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown(onCartClick)}
            >
              <ShoppingCart className="icon-md" aria-hidden="true" />
              {cart?.length > 0 && (
                <span className="cart-badge" aria-live="polite">
                  {cart?.length}
                </span>
              )}
            </div>
          )}
          {isAuthenticated && (
            <div
              className="header-button profile"
              onClick={onProfileClick}
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown(onProfileClick)}
            >
              <User2Icon className="icon-md" user={user} />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default Header
