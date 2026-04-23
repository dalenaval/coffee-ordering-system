import { useGetReceipt } from '@/hooks/useGetReceipt'
import { useOrderStore } from '@/store/useOrderStore'

const ReceiptModal = ({ onClose }) => {
  const orderId = useOrderStore((state) => state.orderId)

  const { data } = useGetReceipt(orderId)

  console.log('order receipt: ', data)

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-close" onClick={onClose}>
          x
        </div>
      </div>
    </div>
  )
}

export default ReceiptModal
