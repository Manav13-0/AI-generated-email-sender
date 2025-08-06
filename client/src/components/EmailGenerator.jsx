import { useState } from 'react'
import { 
  PaperAirplaneIcon, 
  SparklesIcon, 
  PencilIcon,
  CheckCircleIcon,
  
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import RecipientInput from './RecipientInput'
import EmailEditor from './EmailEditor'
import LoadingSpinner from './LoadingSpinner'
import StatusMessage from './StatusMessage'

const API_BASE_URL = 'http://localhost:5000/api'

function EmailGenerator() {
  const [recipients, setRecipients] = useState([])
  const [prompt, setPrompt] = useState('')
  const [context, setContext] = useState('Professional email')
  const [generatedEmail, setGeneratedEmail] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [senderName, setSenderName] = useState('')

  const showStatus = (type, message) => {
    setStatus({ type, message })
    setTimeout(() => setStatus({ type: '', message: '' }), 5000)
  }

  const generateEmail = async () => {
    if (!prompt.trim()) {
      showStatus('error', 'Please enter a prompt for your email')
      return
    }

    setIsGenerating(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-email`, {
        prompt: prompt.trim(),
        recipients,
        context
      })
      
      setGeneratedEmail(response.data)
      showStatus('success', 'Email generated successfully!')
    } catch (error) {
      console.error('Error generating email:', error)
      showStatus('error', error.response?.data?.error || 'Failed to generate email')
    } finally {
      setIsGenerating(false)
    }
  }

  const sendEmail = async () => {
    if (!generatedEmail || recipients.length === 0) {
      showStatus('error', 'Please generate an email and add recipients first')
      return
    }

    setIsSending(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/send-email`, {
        recipients,
        subject: generatedEmail.subject,
        body: generatedEmail.body,
        senderName: senderName.trim() || 'AI Email Sender'
      })
      
      showStatus('success', `Email sent successfully to ${recipients.length} recipient(s)!`)
      
      // Reset form after successful send
      setTimeout(() => {
        setPrompt('')
        setGeneratedEmail(null)
        setRecipients([])
      }, 2000)
      
    } catch (error) {
      console.error('Error sending email:', error)
      showStatus('error', error.response?.data?.error || 'Failed to send email')
    } finally {
      setIsSending(false)
    }
  }

  const updateGeneratedEmail = (field, value) => {
    setGeneratedEmail(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {status.message && (
        <StatusMessage type={status.type} message={status.message} />
      )}

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recipients */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <UserGroupIcon className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recipients</h3>
          </div>
          <RecipientInput recipients={recipients} setRecipients={setRecipients} />
        </div>

        {/* Sender Info */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <PencilIcon className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sender Info</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter your name..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Context
              </label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="input-field"
              >
                <option value="Professional email">Professional</option>
                <option value="Casual email">Casual</option>
                <option value="Marketing email">Marketing</option>
                <option value="Follow-up email">Follow-up</option>
                <option value="Thank you email">Thank you</option>
                <option value="Meeting request">Meeting Request</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Section */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Email Prompt</h3>
        </div>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want your email to be about. For example: 'Schedule a meeting to discuss the new project proposal' or 'Follow up on the client presentation from last week'"
            rows={4}
            className="input-field resize-none"
          />
          <button
            onClick={generateEmail}
            disabled={isGenerating || !prompt.trim()}
            className="btn-primary flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Generating Email...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                <span>Generate Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Email Section */}
      {generatedEmail && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Generated Email</h3>
            </div>
            <span className="text-sm text-gray-500">
              Generated at {new Date(generatedEmail.generatedAt).toLocaleTimeString()}
            </span>
          </div>
          
          <EmailEditor
            email={generatedEmail}
            updateEmail={updateGeneratedEmail}
          />

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={sendEmail}
              disabled={isSending || recipients.length === 0}
              className="btn-primary flex items-center justify-center space-x-2 flex-1"
            >
              {isSending ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Sending Email...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>Send Email ({recipients.length} recipient{recipients.length !== 1 ? 's' : ''})</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setGeneratedEmail(null)}
              className="btn-secondary"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      {!generatedEmail && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
           
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Getting Started</h4>
              <ul className="text-sm text-blue-700 space-y-1">
               
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmailGenerator
