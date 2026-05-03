import { Link } from 'react-router-dom'
import { useState } from 'react'
import './LoginPage.css'
import { useAuthLogin } from '@/hooks/useAuthQuery'
import RegisterModal from '@/components/ui/RegisterModal'

export default function LoginPage() {
  const { mutate: loginUser, isPending } = useAuthLogin()
  const [showSignUp, setShowSignUp] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    loginUser(form)
  }
  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <div className="login-container">
        <div className="login-left">
          <div className="brand-badge">Web Ordering Platform</div>
          <h1 className="brand-title">Kape Nga Ni</h1>
          <p className="brand-description">
            Manage orders, products, and day-to-day café operations in one modern web-based platform.
          </p>
        </div>

        <div className="login-right">
          <form className="login-card" onSubmit={handleSubmit}>
            <div className="login-card-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to Kape Nga Ni dashboard.</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="login-btn" disabled={isPending}>
              {isPending ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="login-footer">
              <div className="sign-up-wrapper">
                <label className="sign-up-label">Love at first sip. Join our coffee community. </label>
                <Link to="#" onClick={() => setShowSignUp(true)}>
                  Create an account
                </Link>
              </div>

              <Link to="/">← Back to Home</Link>
            </div>
          </form>
        </div>
        {showSignUp && <RegisterModal setShowSignUp={setShowSignUp} onClose={() => setShowSignUp(false)} />}
      </div>
    </div>
  )
}
