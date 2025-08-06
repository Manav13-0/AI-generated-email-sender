import { EnvelopeIcon, SparklesIcon } from '@heroicons/react/24/outline'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Email Sender</h2>
              <p className="text-sm text-gray-500">Powered by  AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SparklesIcon className="w-4 h-4" />
            <span>Generate • Edit • Send</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header