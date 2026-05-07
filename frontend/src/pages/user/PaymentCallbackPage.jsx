import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"
import api from "@/api/axios"

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentIntentId = searchParams.get("payment_intent_id")

      if (!paymentIntentId) {
        await Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "Missing payment reference.",
        })
        navigate("/home")
        return
      }

      try {
        const res = await api.post("/payments/verify", {
          payment_intent_id: paymentIntentId,
        })

        const orderId = res.data.order_id
        const status = res.data.status

        if (status === "paid") {
          const result = await Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: "Your digital receipt has been sent to your email.",
            confirmButtonText: "View Receipt",
            showCancelButton: true,
            cancelButtonText: "Back to Home",
          })

          if (result.isConfirmed) {
            navigate(`/orders/${orderId}/receipt`)
          } else {
            navigate("/home")
          }

          return
        }

        if (status === "processing" || status === "awaiting_next_action" || status === "awaiting_payment_method") {
          await Swal.fire({
            icon: "info",
            title: "Payment Processing",
            text: "Your payment is still being processed. Please wait a moment and try again.",
          })
          navigate("/home")
          return
        }

        await Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: "Unable to verify payment.",
        })
        navigate("/home")
      } catch (error) {
        console.error("verify error:", error)
        await Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: error?.response?.data?.detail || "Unable to verify payment.",
        })
        navigate("/home")
      }
    }

    verifyPayment()
  }, [navigate, searchParams])

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Processing your payment...</h2>
      <p>Please wait...</p>
    </div>
  )
}
