# AI Email Sender

A full-stack application for generating and sending professional emails using AI.

| Folder/File         | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| backend/            | Node.js Express server. Handles email generation (Groq API) and sending (SMTP). |
| ├── .env            | Environment variables (API keys, SMTP config).                              |
| ├── package.json    | Backend dependencies and scripts.                                           |
| └── server.js       | Main backend server logic.                                                  |
| client/             | React frontend. User interface for email creation and sending.              |
| ├── index.html      | Main HTML entry point.                                                      |
| ├── package.json    | Frontend dependencies and scripts.                                          |
| ├── vite.config.js  | Vite build configuration.                                                   |
| ├── tailwind.config.js | Tailwind CSS configuration.                                              |
| ├── postcss.config.js  | PostCSS configuration.                                                   |
| ├── src/            | React source code.                                                          |
| │   ├── App.jsx     | Main React app component.                                                   |
| │   ├── components/ | Reusable UI components (EmailEditor, EmailGenerator, etc.).                 |
| │   ├── index.css   | Global styles (Tailwind).                                                   |
| │   └── App.css     | App-specific styles.                                                        |
| └── public/         | Static assets (icons, images).                                              |
| .gitignore          | Git ignore rules.                                                           |

## How it works

1. **Frontend**: User enters prompt, recipients, and context. The app calls backend APIs to generate and send emails.
2. **Backend**: 
   - `/api/generate-email`: Uses Groq API to generate email content.
   - `/api/send-email`: Sends email via SMTP (Ethereal by default).
   - Health and config endpoints for diagnostics.

## Getting Started

1. Clone the repo.
2. Set up `.env` in `backend/` with your Groq API key and SMTP credentials.
3. Install dependencies in both `client/` and `backend/`.
4. Run backend:  
   ```sh
   cd backend
   npm install
   node server.js
