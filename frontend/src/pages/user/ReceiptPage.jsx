import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

export default function ReceiptPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/orders/${orderId}/receipt`)
        setReceipt(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchReceipt()
  }, [orderId])

  const itemCount = useMemo(() => {
    if (!receipt?.items) return 0
    return receipt.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  }, [receipt])

  const subtotal = useMemo(() => {
    if (!receipt?.items) return 0
    return receipt.items.reduce((sum, item) => sum + Number(item.line_total || 0), 0)
  }, [receipt])

  const vatAmount = useMemo(() => {
    const total = Number(receipt?.total_amount || 0)
    const rawSubtotal = Number(subtotal || 0)

    if (total > rawSubtotal) {
      return total - rawSubtotal
    }

    return 0
  }, [receipt, subtotal])

  const formatMoney = (value) => `₱ ${Number(value || 0).toFixed(2)}`

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase()
    if (value === "paid") return "receipt-status paid"
    if (value === "pending") return "receipt-status pending"
    if (value === "failed") return "receipt-status failed"
    return "receipt-status"
  }

  if (loading) {
    return (
      <div className="receipt-page">
        <div className="receipt-shell">
          <div className="receipt-card">
            <div className="receipt-loading">Loading receipt...</div>
          </div>
        </div>
        <style>{receiptStyles}</style>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="receipt-page">
        <div className="receipt-shell">
          <div className="receipt-card">
            <div className="receipt-empty">
              <h2>Receipt not found</h2>
              <p>We couldn’t load the receipt for this order.</p>
              <button className="receipt-primary-btn" onClick={() => navigate("/home")}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <style>{receiptStyles}</style>
      </div>
    )
  }

  return (
    <div className="receipt-page">
      <div className="receipt-shell">
        <div className="receipt-toolbar">
          <button className="receipt-secondary-btn" onClick={() => navigate("/home")}>
            Back to Home
          </button>
          <button className="receipt-primary-btn" onClick={() => window.print()}>
            Print Receipt
          </button>
        </div>

        <div className="receipt-card" id="printable-receipt">
          <div className="receipt-header">
            <div className="receipt-brand-mark">☕</div>
            <h1>Kape Nga Ni</h1>
            <p>Digital Receipt</p>
          </div>

          <div className="receipt-meta-grid">
            <div className="receipt-meta-item">
              <span className="label">Order No</span>
              <strong>{receipt.order_no}</strong>
            </div>
            <div className="receipt-meta-item">
              <span className="label">Order Type</span>
              <strong>{receipt.order_type}</strong>
            </div>
            <div className="receipt-meta-item">
              <span className="label">Status</span>
              <span className={getStatusClass(receipt.status)}>
                {String(receipt.status || "").toUpperCase()}
              </span>
            </div>
            <div className="receipt-meta-item">
              <span className="label">Items</span>
              <strong>{itemCount}</strong>
            </div>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-section">
            <div className="receipt-section-title">Order Items</div>

            <div className="receipt-items">
              {receipt.items?.length > 0 ? (
                receipt.items.map((item) => (
                  <div className="receipt-item-row" key={item.id}>
                    <div className="receipt-item-left">
                      <div className="receipt-item-name">
                        {item.product_name || `Product #${item.product_id}`}
                      </div>
                      <div className="receipt-item-sub">
                        Qty: {item.quantity} · Unit Price: {formatMoney(item.unit_price)}
                      </div>
                      {Number(item.option_total || 0) > 0 && (
                        <div className="receipt-item-sub">
                          Add-ons: {formatMoney(item.option_total)}
                        </div>
                      )}
                    </div>
                    <div className="receipt-item-right">{formatMoney(item.line_total)}</div>
                  </div>
                ))
              ) : (
                <div className="receipt-empty-list">No items found.</div>
              )}
            </div>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-totals">
            <div className="receipt-total-row">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="receipt-total-row">
              <span>VAT / Charges</span>
              <span>{formatMoney(vatAmount)}</span>
            </div>
            <div className="receipt-total-row grand">
              <span>Total Paid</span>
              <span>{formatMoney(receipt.total_amount)}</span>
            </div>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-payment-box">
            <div className="receipt-section-title">Payment Details</div>
            <div className="receipt-payment-grid">
              <div>
                <span className="label">Method</span>
                <strong>{receipt.payment?.payment_method || "N/A"}</strong>
              </div>
              <div>
                <span className="label">Payment Status</span>
                <strong>{receipt.payment?.payment_status || "N/A"}</strong>
              </div>
              <div className="full">
                <span className="label">Reference</span>
                <strong>{receipt.payment?.payment_intent_id || "N/A"}</strong>
              </div>
            </div>
          </div>

          <div className="receipt-footer">
            <p>Thank you for your order.</p>
            <p>Please present this receipt if requested by our staff.</p>
          </div>
        </div>
      </div>

      <style>{receiptStyles}</style>
    </div>
  )
}

const receiptStyles = `
  .receipt-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(107, 66, 38, 0.10), transparent 28%),
      linear-gradient(180deg, #f8f5f1 0%, #f1ebe4 100%);
    padding: 32px 16px;
    box-sizing: border-box;
  }

  .receipt-shell {
    max-width: 860px;
    margin: 0 auto;
  }

  .receipt-toolbar {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 18px;
  }

  .receipt-card {
    background: #ffffff;
    border-radius: 28px;
    padding: 32px;
    box-shadow: 0 18px 50px rgba(45, 30, 19, 0.12);
    border: 1px solid rgba(88, 54, 30, 0.08);
  }

  .receipt-header {
    text-align: center;
    margin-bottom: 24px;
  }

  .receipt-brand-mark {
    width: 68px;
    height: 68px;
    margin: 0 auto 14px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 28px;
    background: linear-gradient(135deg, #5d351b, #8f5f3b);
    color: #fff;
    box-shadow: 0 10px 22px rgba(93, 53, 27, 0.22);
  }

  .receipt-header h1 {
    margin: 0;
    font-size: 34px;
    color: #3f2515;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .receipt-header p {
    margin: 6px 0 0;
    color: #8a6f5b;
    font-size: 15px;
  }

  .receipt-meta-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 22px;
  }

  .receipt-meta-item {
    background: #f8f2eb;
    border: 1px solid #efe2d4;
    border-radius: 18px;
    padding: 16px;
  }

  .receipt-meta-item .label,
  .receipt-payment-grid .label {
    display: block;
    color: #8a6f5b;
    font-size: 12px;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .receipt-meta-item strong,
  .receipt-payment-grid strong {
    color: #3f2515;
    font-size: 16px;
    font-weight: 700;
    word-break: break-word;
  }

  .receipt-status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .receipt-status.paid {
    background: #e9f8ef;
    color: #18794e;
  }

  .receipt-status.pending {
    background: #fff7e6;
    color: #b26b00;
  }

  .receipt-status.failed {
    background: #fdecec;
    color: #c53b3b;
  }

  .receipt-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e6d7c8, transparent);
    margin: 22px 0;
  }

  .receipt-section-title {
    font-size: 14px;
    font-weight: 800;
    color: #70462c;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 14px;
  }

  .receipt-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .receipt-item-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    border-radius: 18px;
    background: #fcfaf7;
    border: 1px solid #efe7dd;
  }

  .receipt-item-left {
    flex: 1;
  }

  .receipt-item-name {
    font-size: 16px;
    font-weight: 700;
    color: #3f2515;
    margin-bottom: 6px;
  }

  .receipt-item-sub {
    font-size: 13px;
    color: #8a6f5b;
    line-height: 1.5;
  }

  .receipt-item-right {
    min-width: 110px;
    text-align: right;
    font-size: 16px;
    font-weight: 800;
    color: #5d351b;
  }

  .receipt-totals {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .receipt-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #5e4638;
    font-size: 15px;
  }

  .receipt-total-row.grand {
    padding-top: 8px;
    font-size: 20px;
    font-weight: 800;
    color: #3f2515;
  }

  .receipt-payment-box {
    background: #f8f2eb;
    border: 1px solid #efe2d4;
    border-radius: 20px;
    padding: 18px;
  }

  .receipt-payment-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .receipt-payment-grid .full {
    grid-column: 1 / -1;
  }

  .receipt-footer {
    text-align: center;
    color: #8a6f5b;
    font-size: 14px;
    margin-top: 10px;
  }

  .receipt-footer p {
    margin: 6px 0;
  }

  .receipt-primary-btn,
  .receipt-secondary-btn {
    border: none;
    border-radius: 14px;
    padding: 12px 18px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .receipt-primary-btn {
    background: linear-gradient(135deg, #6d3e21, #915f39);
    color: #fff;
    box-shadow: 0 10px 20px rgba(109, 62, 33, 0.18);
  }

  .receipt-secondary-btn {
    background: #fff;
    color: #5d351b;
    border: 1px solid #dcc7b6;
  }

  .receipt-loading,
  .receipt-empty,
  .receipt-empty-list {
    text-align: center;
    color: #6f5747;
    padding: 24px;
  }

  @media (max-width: 768px) {
    .receipt-card {
      padding: 22px;
      border-radius: 22px;
    }

    .receipt-header h1 {
      font-size: 28px;
    }

    .receipt-meta-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .receipt-payment-grid {
      grid-template-columns: 1fr;
    }

    .receipt-item-row {
      flex-direction: column;
    }

    .receipt-item-right {
      text-align: left;
      min-width: 0;
    }

    .receipt-toolbar {
      justify-content: stretch;
      flex-direction: column;
    }

    .receipt-primary-btn,
    .receipt-secondary-btn {
      width: 100%;
    }
  }

  @media print {
    .receipt-page {
      background: #fff;
      padding: 0;
    }

    .receipt-toolbar {
      display: none;
    }

    .receipt-card {
      box-shadow: none;
      border: none;
      border-radius: 0;
      padding: 0;
    }
  }
`
