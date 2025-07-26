import Swal from 'sweetalert2';

export const toast = {
  success: (title, description, duration = 4000) => {
    Swal.fire({
      title: `${title}`,
      text: description,
      icon: 'success',
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      background: '#f0fdf4',
      color: '#166534',
      customClass: {
        popup: 'rounded-lg border-l-4 border-l-green-500 shadow-lg'
      }
    });
  },

  error: (title, description, duration = 5000) => {
    Swal.fire({
      title: `❌ ${title}`,
      text: description,
      icon: 'error',
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      background: '#fef2f2',
      color: '#dc2626',
      customClass: {
        popup: 'rounded-lg border-l-4 border-l-red-500 shadow-lg'
      }
    });
  },

  warning: (title, description, duration = 6000) => {
    Swal.fire({
      title: `⚠️ ${title}`,
      text: description,
      icon: 'warning',
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      background: '#fffbeb',
      color: '#d97706',
      customClass: {
        popup: 'rounded-lg border-l-4 border-l-yellow-500 shadow-lg'
      }
    });
  },

  info: (title, description, duration = 3000) => {
    Swal.fire({
      title: `ℹ️ ${title}`,
      text: description,
      icon: 'info',
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      background: '#eff6ff',
      color: '#2563eb',
      customClass: {
        popup: 'rounded-lg border-l-4 border-l-blue-500 shadow-lg'
      }
    });
  },

  action: (title, description, actionText, onAction, duration = 7000) => {
    Swal.fire({
      title: `🚚 ${title}`,
      text: description,
      icon: 'info',
      toast: true,
      position: 'bottom-end',
      showConfirmButton: true,
      confirmButtonText: actionText,
      confirmButtonColor: '#3b82f6',
      showCancelButton: false,
      timer: duration,
      timerProgressBar: true,
      background: '#f0f9ff',
      color: '#1e40af',
      customClass: {
        popup: 'rounded-lg border-l-4 border-l-blue-500 shadow-lg',
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors'
      }
    }).then((result) => {
      if (result.isConfirmed && onAction) {
        onAction();
      }
    });
  }
}; 