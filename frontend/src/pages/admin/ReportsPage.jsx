import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import api from '../../api/axios'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'
import './AdminPages.css'

export default function ReportsPage() {
  const today = new Date().toISOString().split('T')[0]

  const [filters, setFilters] = useState({
    date_from: '',
    date_to: today,
  })

  const [data, setData] = useState({
    total_sales: 0,
    total_orders: 0,
    best_products: [],
    lease_products: [],
    daily_orders: [],
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchReports = async (overrideFilters) => {
    try {
      setLoading(true)

      const activeFilters = overrideFilters ?? filters
      const params = {}
      if (activeFilters.date_from) params.date_from = activeFilters.date_from
      if (activeFilters.date_to) params.date_to = activeFilters.date_to

      const res = await api.get('/reports/summary', { params })

      setData({
        total_sales: res.data?.total_sales || 0,
        total_orders: res.data?.total_orders || 0,
        best_products: Array.isArray(res.data?.best_products) ? res.data.best_products : [],
        least_products: Array.isArray(res.data?.least_products) ? res.data.least_products : [],
        daily_orders: Array.isArray(res.data?.daily_orders) ? res.data.daily_orders : [],
      })
    } catch (error) {
      console.error('Failed to load reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const applyTodayFilter = () => {
    const next = { date_from: today, date_to: today }
    setFilters(next)
    fetchReports(next)
  }

  const applyLast7Days = () => {
    const d = new Date()
    d.setDate(d.getDate() - 6)
    const from = d.toISOString().split('T')[0]

    const next = { date_from: from, date_to: today }
    setFilters(next)
    fetchReports(next)
  }

  const clearFilters = () => {
    const next = { date_from: '', date_to: today }
    setFilters(next)
    fetchReports(next)
  }

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1'
    if (index === 1) return 'rank-2'
    if (index === 2) return 'rank-3'
    return 'rank-default'
  }

  const hasChartData = data.daily_orders.length > 0

  return (
    <AdminLayout title="Reports">
      <section className="admin-hero-card">
        <span className="admin-hero-badge">📊 Analytics Dashboard</span>
        <h2>Business Reports</h2>
        <p>
          Monitor sales performance, order activity, and product movement with visual insights and date-based filtering.
        </p>
      </section>

      <div className="admin-page-card">
        <div className="admin-page-head">
          <h2>Filters</h2>
          <p>Filter reports by custom date range.</p>
        </div>

        <div className="admin-toolbar">
          <input type="date" name="date_from" value={filters.date_from} onChange={handleChange} />

          <input type="date" name="date_to" value={filters.date_to} onChange={handleChange} />

          <button type="button" onClick={() => fetchReports()}>
            Apply Filter
          </button>

          <button type="button" className="quick-action-btn secondary" onClick={applyTodayFilter}>
            Today
          </button>

          <button type="button" className="quick-action-btn secondary" onClick={applyLast7Days}>
            Last 7 Days
          </button>

          <button type="button" className="quick-action-btn secondary" onClick={clearFilters}>
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-page-card" style={{ marginTop: '24px' }}>
          <p>Loading reports...</p>
        </div>
      ) : (
        <>
          <div className="reports-grid" style={{ marginTop: '24px' }}>
            <div className="report-card">
              <h4>Estimated Total Sales</h4>
              <h2>₱{Number(data.total_sales).toLocaleString()}</h2>
            </div>

            <div className="report-card light">
              <h4>Total Orders</h4>
              <h2>{Number(data.total_orders).toLocaleString()}</h2>
            </div>

            <div className="report-card light">
              <h4>Top Products</h4>
              <h2>{data.best_products.length}</h2>
            </div>
          </div>

          <div className="admin-feature-grid">
            <div className="admin-page-card">
              <div className="admin-page-head">
                <h2>Sales Trend</h2>
                <p>Sales amount by date</p>
              </div>

              <div className="real-chart-box">
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data.daily_orders}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-box">No chart data available.</div>
                )}
              </div>
            </div>

            <div className="admin-page-card">
              <div className="admin-page-head">
                <h2>Order Volume</h2>
                <p>Number of orders by date</p>
              </div>

              <div className="real-chart-box">
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.daily_orders}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-box">No chart data available.</div>
                )}
              </div>
            </div>
          </div>

          <div className="admin-page-card" style={{ marginTop: '24px' }}>
            <div className="admin-page-head">
              <h2>Best Selling Products</h2>
              <p>Top performing items based on quantity sold.</p>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Product</th>
                    <th>Total Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {data.best_products.length > 0 ? (
                    data.best_products.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className={`rank-badge ${getRankClass(index)}`}>#{index + 1}</span>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.total_sold}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="empty-state-cell">
                        No sales data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-page-card" style={{ marginTop: '24px' }}>
            <div className="admin-page-head">
              <h2>Least Selling Products</h2>
              <p>Lowest performing items based on quantity sold.</p>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Product</th>
                    <th>Total Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {data.least_products.length > 0 ? (
                    data.least_products.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className="rank-badge rank-default">#{index + 1}</span>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.total_sold}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="empty-state-cell">
                        No least selling data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
