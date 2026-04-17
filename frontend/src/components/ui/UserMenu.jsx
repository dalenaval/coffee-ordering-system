import { useAuth } from '@/store/useAuthStore'
import './UserMenu.css'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const UserMenu = ({ isOpen, onClose }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success',
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons
      .fire({
        text: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          logout()
          navigate('/login')
        }
      })
  }

  if (!isOpen) return null

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>Profile</h2>
          <button className="profile-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="profile-footer">
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserMenu
