import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

function RecipientInput({ recipients, setRecipients }) {
  const [emailInput, setEmailInput] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const addRecipient = () => {
    const email = emailInput.trim().toLowerCase()
    
    if (!email) {
      setError('Please enter an email address')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    if (recipients.includes(email)) {
      setError('This email is already in the list')
      return
    }
    
    setRecipients([...recipients, email])
    setEmailInput('')
    setError('')
  }

  const removeRecipient = (emailToRemove) => {
    setRecipients(recipients.filter(email => email !== emailToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addRecipient()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="flex-1">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value)
              setError('')
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter email address..."
            className={`input-field ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
          />
          {error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
          )}
        </div>
        <button
          onClick={addRecipient}
          className="btn-primary p-2 flex-shrink-0"
          title="Add recipient"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {recipients.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Recipients ({recipients.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {recipients.map((email) => (
              <div
                key={email}
                className="flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{email}</span>
                <button
                  onClick={() => removeRecipient(email)}
                  className="hover:text-primary-900 transition-colors"
                  title="Remove recipient"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {recipients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No recipients added yet</p>
          <p className="text-xs mt-1">Add email addresses to send your generated email</p>
        </div>
      )}
    </div>
  )
}

export default RecipientInput