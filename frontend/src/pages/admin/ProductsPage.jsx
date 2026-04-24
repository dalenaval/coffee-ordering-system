import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getMenuList, getLowStockProducts, restockProduct, getProducts } from '../../api/productService'
import './AdminPages.css'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [restockQty, setRestockQty] = useState({})
  const [remarks, setRemarks] = useState({})

  useEffect(() => {
    fetchProducts()
    fetchLowStock()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const fetchLowStock = async () => {
    try {
      const data = await getLowStockProducts()
      setLowStock(data)
    } catch (error) {
      console.error('Failed to load low stock items:', error)
    }
  }

  const handleRestock = async (productId) => {
    try {
      const quantity = Number(restockQty[productId] || 0)
      if (quantity <= 0) return

      await restockProduct(productId, {
        quantity,
        remarks: remarks[productId] || null,
      })

      setRestockQty((prev) => ({ ...prev, [productId]: '' }))
      setRemarks((prev) => ({ ...prev, [productId]: '' }))

      fetchProducts()
      fetchLowStock()
    } catch (error) {
      console.error('Failed to restock product:', error)
    }
  }

  return (
    <AdminLayout title="Products">
      <div className="admin-page-card">
        <div className="admin-page-head">
          <h2>Low Stock Alerts</h2>
          <p>Products that need replenishment.</p>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Restock Qty</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length > 0 ? (
                lowStock.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.stock}</td>
                    <td>
                      <span className={`badge ${item.status === 'OUT OF STOCK' ? 'cancelled' : 'pending'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={restockQty[item.id] || ''}
                        onChange={(e) => setRestockQty((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={remarks[item.id] || ''}
                        onChange={(e) => setRemarks((prev) => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Optional remarks"
                      />
                    </td>
                    <td>
                      <button type="button" className="admin-action-btn" onClick={() => handleRestock(item.id)}>
                        Restock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state-cell">
                    All product stocks are healthy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-page-card" style={{ marginTop: '24px' }}>
        <div className="admin-page-head">
          <h2>All Products</h2>
          <p>Current inventory overview.</p>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th>Stock</th>
                <th>Threshold</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₱{Number(item.price).toLocaleString()}</td>
                  <td>{item.is_available ? 'Yes' : 'No'}</td>
                  <td>{item.stock}</td>
                  <td>{item.low_stock_threshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
