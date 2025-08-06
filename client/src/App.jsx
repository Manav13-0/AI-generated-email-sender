import { useState } from 'react'
import EmailGenerator from './components/EmailGenerator'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          <div className="text-section">
            <h1>AI Email Generator</h1>
            <p>
              Create professional emails with AI assistance. Simply provide your prompt and recipients, 
              then let our AI generate a polished email that you can edit and send.
            </p>
          </div>
          <EmailGenerator />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
