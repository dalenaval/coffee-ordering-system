'use client'

import { useEffect, useMemo, useState } from 'react'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import ProductModal from '@/components/ui/ProductModal'
import ProductCatalog from '@/components/ui/productCatalog'
import Cart from '@/components/ui/Cart'
import './HomePage.css'
import CheckoutForm from '@/components/ui/CheckoutForm'
import { getPublicSystemControls } from '@/api/systemControlService'

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

  const [systemSettings, setSystemSettings] = useState(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      initializeSession()
    }
  }, [initializeSession, isAuthenticated])

  useEffect(() => {
    fetchPublicSettings()
  }, [])

  const fetchPublicSettings = async () => {
    try {
      setSettingsLoading(true)
      const data = await getPublicSystemControls()
      setSystemSettings(data)
    } catch (error) {
      console.error('Failed to load system settings:', error)
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleSelectedProduct = (product) => {
    if (systemSettings?.menu_visibility !== 'Published') return
    if (systemSettings?.website_ordering !== 'Enabled') return
    setSelectedProduct(product)
  }

  const handleCheckout = () => {
    if (systemSettings?.website_ordering !== 'Enabled') return
    if (systemSettings?.order_acceptance !== 'Open') return

    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleOrderComplete = (order) => {
    console.log('order:', order)
    setIsCheckoutOpen(false)
  }

  const storeName = systemSettings?.store_name || 'Kape Nga Ni'
  const websiteOrderingEnabled = systemSettings?.website_ordering === 'Enabled'
  const menuVisible = systemSettings?.menu_visibility === 'Published'
  const orderAcceptanceOpen = systemSettings?.order_acceptance === 'Open'

  const systemMessage = useMemo(() => {
    if (!systemSettings) return ''
    if (!websiteOrderingEnabled) return 'Online ordering is currently unavailable.'
    if (!menuVisible) return 'Menu is currently hidden.'
    if (!orderAcceptanceOpen) return 'We are currently not accepting orders.'
    return ''
  }, [systemSettings, websiteOrderingEnabled, menuVisible, orderAcceptanceOpen])

  return (
    <div>
      <Header onCartClick={() => setIsCartOpen(true)} onProfileClick={() => setIsProfileOpen(true)} showCart />

      <main className="main-content">
        <div className="hero-section">
          <h1>Welcome {isAuthenticated ? `${user?.full_name} !` : `to ${storeName}`}</h1>
          <p>Discover your perfect brew</p>
        </div>

        {settingsLoading ? (
          <div className="system-banner">Loading store settings...</div>
        ) : systemMessage ? (
          <div className="system-banner system-banner-warning">{systemMessage}</div>
        ) : null}

        {menuVisible && websiteOrderingEnabled ? (
          <ProductCatalog onCustomize={handleSelectedProduct} />
        ) : (
          <div className="system-empty-state">
            <h2>Ordering is not available right now</h2>
            <p>Please check back again later.</p>
          </div>
        )}
      </main>

      {selectedProduct && menuVisible && websiteOrderingEnabled && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />

      <UserMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onCheckout={handleCheckout} />

      {isCheckoutOpen && websiteOrderingEnabled && orderAcceptanceOpen && (
        <CheckoutForm
          cartItems={cartItems}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={handleOrderComplete}
          systemSettings={systemSettings}
        />
      )}

      <Footer />
    </div>
  )
}

export default HomePage
