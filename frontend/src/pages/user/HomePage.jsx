'use client'

import { useEffect, useMemo, useState } from 'react'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import ProductModal from '@/components/ui/ProductModal'
import ProductCatalog from '@/components/ui/ProductCatalog'
import Cart from '@/components/ui/Cart'
import './HomePage.css'
import CheckoutForm from '@/components/ui/CheckoutForm'
import { getPublicSystemControls } from '@/api/systemControlService'

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

  const [systemSettings, setSystemSettings] = useState(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    const paymentIntentId = params.get('payment_intent_id')

    if (paymentIntentId) {
      // Call backend to verify payment status
      console.log('Verify payment:', paymentIntentId)

      // Example:
      // fetch(`/api/payments/verify/${paymentIntentId}`)
    }
  }, [params])

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
    setIsCheckOutOpen(true)
  }

  const handleOrderComplete = (order) => {
    console.log('order:', order)
    setIsCheckOutOpen(false)
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

      {isCheckOutOpen && websiteOrderingEnabled && orderAcceptanceOpen && (
        <CheckoutForm
          cartItems={cartItems}
          onClose={() => setIsCheckOutOpen(false)}
          onOrderComplete={handleOrderComplete}
          systemSettings={systemSettings}
        />
      )}

      <Footer />
    </div>
  )
}

export default HomePage
