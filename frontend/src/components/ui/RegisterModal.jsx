import React, { useState } from 'react'
import './RegisterModal.css'
import { Eye, EyeClosed } from 'lucide-react'
import { registerUser, verifyEmail } from '@/api/userService'
import Swal from 'sweetalert2'

const RegisterModal = ({ setShowSignUp, onClose }) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'customer',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showCPassword, setShowCPassword] = useState(false)
  const [confirmPassword, setConfirmPasword] = useState('')

  const isPending = false

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (form.password === confirmPassword) {
        await registerUser(form)

        Swal.fire({
          icon: 'success',
          text: 'Account Created',
          confirmButtonText: 'Proceed to Login',
        }).then((result) => {
          if (result.isConfirmed) {
            setShowSignUp(false)
            navigation('/login')
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Password does not match !',
        })
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong please try again !',
      })
    }
  }

  const handleVerification = async () => {
    if (!form.email) return

    try {
      const verifyRes = await verifyEmail({ email: form.email })
      console.log(verifyRes)
      Swal.fire({
        icon: 'success',
        text: verifyRes.detail,
        timer: 1500,
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong',
      })
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={onClose}>
          x
        </div>
        <div className="modal-header">
          <h2>Register</h2>
        </div>
        <div>
          <form className="sign-up-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="email">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="email">
                Email Address
              </label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  style={{ paddingRight: '70px', width: '100%', boxSizing: 'border-box' }}
                  required
                />

                {/* The clickable icon or button */}
                <button type="button" className="form-input-button" role="button" onClick={handleVerification}>
                  Verify
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  style={{ paddingRight: '70px', width: '100%', boxSizing: 'border-box' }}
                  required
                />
                {showPassword ? (
                  <Eye className="form-input-button" onClick={() => setShowPassword(false)} />
                ) : (
                  <EyeClosed className="form-input-button" onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">
                Confirm Password
              </label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showCPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPasword(e.target.value)}
                  style={{ paddingRight: '70px', width: '100%', boxSizing: 'border-box' }}
                />
                {showCPassword ? (
                  <Eye className="form-input-button" onClick={() => setShowCPassword(false)} />
                ) : (
                  <EyeClosed className="form-input-button" onClick={() => setShowCPassword(true)} />
                )}
              </div>
            </div>

            <button type="submit" className="login-btn " disabled={isPending}>
              {isPending ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal
