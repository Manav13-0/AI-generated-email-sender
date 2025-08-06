const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'https://ai-generated-email-sender-client.onrender.com' }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// ✅ UPDATED: Create Ethereal-compatible transporter
const createTransporter = () => {
  console.log('📧 Creating email transporter...');
  console.log('Email User:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
  console.log('Email Pass:', process.env.EMAIL_PASS ? 'Set' : 'NOT SET');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS environment variables are required');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: true,
    logger: true
  });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: {
      email_configured: !!process.env.EMAIL_USER,
      groq_configured: !!process.env.GROQ_API_KEY
    }
  });
});

// Email test config
app.get('/api/test-email-config', async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({
        error: 'Email credentials missing in .env'
      });
    }

    const transporter = createTransporter();
    await transporter.verify();

    res.json({
      status: 'Email config is valid',
      user: process.env.EMAIL_USER,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Email config failed',
      details: error.message,
      code: error.code
    });
  }
});

// Generate email with Groq
app.post('/api/generate-email', async (req, res) => {
  try {
    const { prompt, recipients, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const recipientText = recipients && recipients.length > 0
      ? `Recipients: ${recipients.join(', ')}\n`
      : '';

    const fullPrompt = `${recipientText}Context: ${context || 'Professional email'}\n\nPrompt: ${prompt}\n\nPlease generate a professional email with a clear subject line and body. Format your response as JSON with "subject" and "body" fields.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional email writer. Generate emails that are clear, professional, and appropriate for business communication. Always respond with valid JSON containing 'subject' and 'body' fields."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1024
    });

    let emailContent;
    try {
      emailContent = JSON.parse(completion.choices[0]?.message?.content);
    } catch {
      const content = completion.choices[0]?.message?.content || '';
      const lines = content.split('\n');
      emailContent = {
        subject: lines[0] || 'Generated Email',
        body: lines.slice(1).join('\n') || content
      };
    }

    res.json({
      subject: emailContent.subject,
      body: emailContent.body,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate email',
      details: error.message,
      code: error.code
    });
  }
});

// ✅ UPDATED: Send email with Ethereal + multiple recipients + preview URL
app.post('/api/send-email', async (req, res) => {
  try {
    const { recipients, subject, body, senderName } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients are required' });
    }

    if (!subject || !body) {
      return res.status(400).json({ error: 'Subject and body are required' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        error: 'Email credentials not configured'
      });
    }

    const transporter = createTransporter();
    await transporter.verify();

    const mailOptions = {
      from: `${senderName || 'AI Email Sender'} <${process.env.EMAIL_USER}>`,
      to: recipients.join(', '),
      subject: subject,
      html: body.replace(/\n/g, '<br>'),
      text: body
    };

    const result = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(result);

    res.json({
      success: true,
      messageId: result.messageId,
      recipients,
      previewUrl,
      sentAt: new Date().toISOString()
    });

  } catch (error) {
    let userMessage = 'Failed to send email';
    let details = error.message;

    if (error.code === 'EAUTH' || error.responseCode === 535) {
      userMessage = 'Email authentication failed';
      details = 'Use correct username & password. For Gmail, use App Password.';
    } else if (error.code === 'ECONNECTION') {
      userMessage = 'Connection to email server failed';
      details = 'Check internet or SMTP config';
    }

    res.status(500).json({
      error: userMessage,
      details,
      code: error.code,
      responseCode: error.responseCode
    });
  }
});

// Global error handler
app.use((error, req, res, next) => {
  res.status(500).json({
    error: 'Internal server error',
    details: error.message
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🤖 Groq: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
});
