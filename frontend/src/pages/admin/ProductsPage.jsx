import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getMenuList, getLowStockProducts, restockProduct, getProducts } from '../../api/productService'
import './AdminPages.css'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    isAvailable: true,
    stock: '',
    lowStockThreshold: '',
    imageUrl: '',
    descriptions: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  return (
    <AdminLayout title="Products">
      <div className="employee-workspace-grid">
        <div className="admin-page-card employee-form-card">
          <div className="admin-page-head">
            <h2>{editingId ? 'Edit Product' : 'Create Product'}</h2>
            <p>Maintain product records, assign categories, and manage customization options.</p>
          </div>

          <form className="employee-form-grid" onSubmit={() => {}}>
            <div className="employee-form-field">
              <label>Product Name</label>
              <input
                className="settings-control"
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="employee-form-field">
              <label>Employee Email</label>
              <input
                className="settings-control"
                name="email"
                type="email"
                placeholder="Enter employee email"
                value={''}
                onChange={() => {}}
              />
            </div>

            <div className="employee-form-actions">
              <button type="submit" className="system-save-btn" disabled={false}>
                Add Product
              </button>

              <button type="button" className="secondary-action-btn" onClick={() => {}}>
                Clear Form
              </button>
            </div>
          </form>
        </div>

        <div className="admin-page-card employee-insights-card">
          <div className="admin-page-head">
            <h2>Workforce Insights</h2>
            <p>Quick overview of your current internal team structure.</p>
          </div>

          <div className="employee-insight-list">
            <div className="employee-insight-item">
              <span className="employee-insight-icon">🧑‍💼</span>
              <div>
                <strong> Management Role</strong>
                <p>Users assigned with manager access.</p>
              </div>
            </div>

            <div className="employee-insight-item">
              <span className="employee-insight-icon">✅</span>
              <div>
                <strong> Ready for Operations</strong>
                <p>Employees currently marked active in the system.</p>
              </div>
            </div>

            <div className="employee-insight-item">
              <span className="employee-insight-icon">🔒</span>
              <div>
                <p>Employees with linked internal login accounts.</p>
              </div>
            </div>

            <div className="employee-insight-item">
              <span className="employee-insight-icon">📌</span>
              <div>
                <strong> Inactive Personnel</strong>
                <p>Employees currently unavailable for active assignment.</p>
              </div>
            </div>
          </div>
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
