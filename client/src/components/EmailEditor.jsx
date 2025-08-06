import { useState } from 'react'
import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline'

function EmailEditor({ email, updateEmail }) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSubjectChange = (e) => {
    updateEmail('subject', e.target.value)
  }

  const handleBodyChange = (e) => {
    updateEmail('body', e.target.value)
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Email Content</h4>
        <button
          onClick={toggleEdit}
          className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          {isEditing ? (
            <>
              <EyeIcon className="w-4 h-4" />
              <span>Preview</span>
            </>
          ) : (
            <>
              <PencilIcon className="w-4 h-4" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {/* Editable Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Line
            </label>
            <input
              type="text"
              value={email.subject}
              onChange={handleSubjectChange}
              className="input-field font-medium"
              placeholder="Email subject..."
            />
          </div>

          {/* Editable Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Body
            </label>
            <textarea
              value={email.body}
              onChange={handleBodyChange}
              rows={12}
              className="input-field font-mono text-sm resize-none"
              placeholder="Email content..."
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview Subject */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-sm text-gray-600 mb-1">Subject:</div>
            <div className="font-semibold text-gray-900">{email.subject}</div>
          </div>

          {/* Preview Body */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="text-sm text-gray-600 mb-3">Email Preview:</div>
            <div 
              className="prose prose-sm max-w-none text-gray-900 whitespace-pre-wrap"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {email.body}
            </div>
          </div>
        </div>
      )}

      {/* Character Counts */}
      <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
        <span>Subject: {email.subject.length} characters</span>
        <span>Body: {email.body.length} characters</span>
      </div>
    </div>
  )
}

export default EmailEditor