import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

function StatusMessage({ type, message, onClose }) {
  const styles = {
    success: {
      container: 'bg-green-50 border border-green-200 text-green-800',
      icon: 'text-green-600',
      IconComponent: CheckCircleIcon
    },
    error: {
      container: 'bg-red-50 border border-red-200 text-red-800',
      icon: 'text-red-600',
      IconComponent: ExclamationCircleIcon
    }
  }

  const style = styles[type] || styles.error
  const { IconComponent } = style

  return (
    <div className={`rounded-lg p-4 ${style.container}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${style.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success' 
                  ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                  : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusMessage