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
import { useAuth } from '@/store/useAuthStore'
import UserMenu from '@/components/ui/UserMenu'
import { useSessionStore } from '@/store/useSessionStore'
import { useOrderStore } from '@/store/useOrderStore'
import { apiUrl } from '@/config/config'
import { useSearchParams } from 'react-router-dom'

const HomePage = () => {
  const [params] = useSearchParams()
  const isCheckOutOpen = useOrderStore((state) => state.isCheckOutOpen)
  const setIsCheckOutOpen = useOrderStore((state) => state.setIsCheckOutOpen)

  const { user, isAuthenticated } = useAuth()

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const paymentIntentId = params.get('payment_intent_id')

    if (paymentIntentId) {
      // Call backend to verify payment status
      console.log('Verify payment:', paymentIntentId)

      // Example:
      // fetch(`/api/payments/verify/${paymentIntentId}`)
    }
  }, [params])

  const handleSelectedProduct = (product) => {
    setSelectedProduct(product)
  }

  const handleCheckout = () => {
    setIsCartOpen(false)
    setIsCheckOutOpen(true)
  }

  const handleOrderComplete = (order) => {
    console.log('order:', order)
    setIsCheckOutOpen(false)
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
      {isCheckOutOpen && (
        <CheckoutForm onClose={() => setIsCheckOutOpen(false)} onOrderComplete={handleOrderComplete} />
      )}
      <Footer />
    </div>
  )
}

export default HomePage
