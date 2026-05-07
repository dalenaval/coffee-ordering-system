import { registerUser, checkEmail, verifyEmail } from '@/api/userService'
import { useMutation } from '@tanstack/react-query'
import Swal from 'sweetalert2'

export const useCheckEmailAvailability = () => {
  return useMutation({
    mutationFn: ({ email }) => checkEmail(email),
    onSuccess: (data) => {
      Swal.fire({
        icon: 'success',
        text: data.detail,
        timer: 1500,
        showConfirmButton: false,
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:
          error.response.data?.detail[0]?.msg ||
          error?.response?.data?.detail ||
          'Something went wrong. Please try again!',
      })
    },
  })
}

export const useCreateUser = () => {
  return useMutation({
    mutationFn: ({ payload }) => registerUser(payload),
    onSuccess: () => {
      let timerInterval
      Swal.fire({
        icon: 'success',
        titleText: 'Account Created',
        html: 'Please check your email to verify your account. <br> Confirm will be available in <b>5</b> seconds.',
        confirmButtonText: 'Ok',
        allowOutsideClick: false,
        didOpen: () => {
          // 1. Disable the confirm button initially
          const confirmButton = Swal.getConfirmButton()
          confirmButton.disabled = true

          let secondsLeft = 5
          const b = Swal.getHtmlContainer().querySelector('b')

          // 2. Start the countdown interval
          timerInterval = setInterval(() => {
            secondsLeft -= 1
            b.textContent = secondsLeft

            if (secondsLeft <= 0) {
              clearInterval(timerInterval)
              confirmButton.disabled = false // Enable button at 0
              b.parentElement.innerHTML = 'You can now proceed.'
            }
          }, 1000)
        },
        willClose: () => {
          clearInterval(timerInterval)
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error?.response?.data?.detail || 'Something went wrong. Please try again!',
      })
    },
  })
}

export const useEmailVerification = () => {
  return useMutation({
    mutationFn: ({ token }) => verifyEmail(token),

    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Email Verified',
        text: 'Your email has been verified successfully.',
      })
    },
    onError: (error) => {
      console.log(error || 'Error verifying email')
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error?.response?.data?.detail || 'Something went wrong. Please try again!',
      })
    },
  })
}
