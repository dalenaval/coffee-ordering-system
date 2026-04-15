import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getOrders, getOrderDetails, updateOrderStatus } from "../../api/orderService";
import "./AdminPages.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        const updated = await getOrderDetails(orderId);
        setSelectedOrder(updated);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleOpenModal = async (order) => {
    try {
      const details = await getOrderDetails(order.id);
      setSelectedOrder(details);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to load order details:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.toLowerCase();
      const matchSearch =
        order.order_no?.toLowerCase().includes(q) ||
        order.customer_name?.toLowerCase().includes(q);

      const matchStatus = statusFilter === "" || order.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <AdminLayout title="Orders">
      <div className="admin-page-card">
        <div className="admin-page-head">
          <h2>Customer Orders</h2>
          <p>Manage and monitor customer transactions in real time.</p>
        </div>

        <div className="admin-toolbar">
          <input
            type="text"
            placeholder="Search order or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button type="button" onClick={fetchOrders}>
            Refresh
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Customer</th>
                <th>Order Type</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_no}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.order_type}</td>
                    <td>
                      <span className={`badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>₱{Number(order.total_amount).toLocaleString()}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => handleOpenModal(order)}
                      >
                        View Details
                      </button>

                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state-cell">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div>
                <h3>Order Details</h3>
                <p>Customer order information and items</p>
              </div>
              <button type="button" className="admin-modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <div className="admin-modal-grid">
              <div className="admin-detail-item">
                <label>Order No.</label>
                <span>{selectedOrder.order_no}</span>
              </div>
              <div className="admin-detail-item">
                <label>Customer</label>
                <span>{selectedOrder.customer_name}</span>
              </div>
              <div className="admin-detail-item">
                <label>Order Type</label>
                <span>{selectedOrder.order_type}</span>
              </div>
              <div className="admin-detail-item">
                <label>Status</label>
                <span>{selectedOrder.status}</span>
              </div>
              <div className="admin-detail-item">
                <label>Subtotal</label>
                <span>₱{Number(selectedOrder.subtotal).toLocaleString()}</span>
              </div>
              <div className="admin-detail-item">
                <label>Total</label>
                <span>₱{Number(selectedOrder.total_amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="admin-page-card" style={{ marginTop: "20px", padding: "18px" }}>
              <div className="admin-page-head">
                <h2 style={{ fontSize: "22px" }}>Ordered Items</h2>
                <p>Products included in this order</p>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.length > 0 ? (
                      selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>₱{Number(item.unit_price).toLocaleString()}</td>
                          <td>₱{Number(item.line_total).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="empty-state-cell">
                          No order items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
