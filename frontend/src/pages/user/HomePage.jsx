'use-client'

import { useEffect, useState } from 'react'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import ProductModal from '@/components/ui/ProductModal'
import ProductCatalog from '@/components/ui/productCatalog'
import Cart from '@/components/ui/Cart'
import './HomePage.css'
import CheckoutForm from '@/components/ui/CheckoutForm'

// Stored data in local | zustand
import { cartStore } from '@/store/useCartStore'
import { useAuth } from '@/store/useAuthStore'
import UserMenu from '@/components/ui/UserMenu'
import { useSessionStore } from '@/store/useSessionStore'

const HomePage = () => {
  const cartItems = cartStore((state) => state.cartItems)
  const initializeSession = useSessionStore((state) => state.initializeSession)

  const { user, isAuthenticated } = useAuth()

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      initializeSession()
    }
  }, [initializeSession, isAuthenticated])

  const handleSelectedProduct = (product) => {
    setSelectedProduct(product)
  }

  const handleCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleOrderComplete = (order) => {
    console.log('order:', order)
    setIsCheckoutOpen(false)
  }

  return (
    <div>
      <Header onCartClick={() => setIsCartOpen(true)} onProfileClick={() => setIsProfileOpen(true)} showCart />

      <main className="main-content">
        <div className="hero-section">
          <h1>Welcome {isAuthenticated ? `${user?.full_name} !` : 'to Kape Nga Ni'}</h1>
          <p>Discover your perfect brew</p>
        </div>

        <ProductCatalog onCustomize={handleSelectedProduct} />
      </main>
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />
      <UserMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onCheckout={handleCheckout} />
      {isCheckoutOpen && (
        <CheckoutForm
          cartItems={cartItems}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={handleOrderComplete}
        />
      )}
      <Footer />
    </div>
  )
}

export default HomePage
