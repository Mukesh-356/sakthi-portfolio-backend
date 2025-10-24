import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// CORS middleware for this route
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ✅ ADD THIS TEST ENDPOINT
router.get('/test', (req, res) => {
  console.log('✅ Contact test route hit');
  res.json({ 
    success: true, 
    message: 'Contact route is working!',
    timestamp: new Date().toISOString(),
    emailConfigured: !!process.env.EMAIL_USER
  });
});

// ✅ ADD EMAIL TEST ENDPOINT
router.get('/test-email', async (req, res) => {
  try {
    console.log('📧 Testing email configuration...');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: 'Email credentials not configured'
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('🔄 Verifying email transporter...');
    await transporter.verify();
    console.log('✅ Email transporter verified');

    res.json({ 
      success: true, 
      message: 'Email configuration is correct',
      email: process.env.EMAIL_USER
    });
  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Email configuration error',
      error: error.message 
    });
  }
});

// Main contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log('📧 Contact form submission received:', { name, email, message: message?.substring(0, 50) + '...' });

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    console.log('🔄 Creating email transport...');
    
    // Enhanced email transporter with better configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use App Password, not regular password
      },
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ Email transporter verified');

    // Email to portfolio owner (you)
    const ownerMailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `🎨 New Portfolio Message - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>New Contact Form Submission</h1>
                <p>From your 3D Portfolio Website</p>
            </div>
            <div class="content">
                <div class="info-box">
                    <h3>👤 Contact Information</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <div class="info-box">
                    <h3>💬 Message</h3>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
            <div class="footer">
                <p>This message was sent from your portfolio contact form</p>
            </div>
        </body>
        </html>
      `
    };

    // Confirmation email to the user
    const userMailOptions = {
      from: `"3D Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Message Received - 3D Portfolio',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Thank You for Reaching Out! 🎨</h1>
                <p>Your message has been received</p>
            </div>
            <div class="content">
                <div class="info-box">
                    <h3>Hello ${name},</h3>
                    <p>Thank you for contacting me through my 3D portfolio website. I have received your message and will review it shortly.</p>
                    <p><strong>What to expect next:</strong></p>
                    <ul>
                        <li>I typically respond within 6-12 hours</li>
                        <li>We'll discuss your project requirements</li>
                        <li>I'll provide a detailed proposal and timeline</li>
                    </ul>
                </div>
                <div class="info-box">
                    <h3>📋 Your Message Summary</h3>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Message Preview:</strong> "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"</p>
                </div>
            </div>
            <div class="footer">
                <p>This is an automated confirmation. Please do not reply to this email.</p>
            </div>
        </body>
        </html>
      `
    };

    console.log('📤 Sending emails...');
    
    // Send emails
    await transporter.sendMail(ownerMailOptions);
    console.log('✅ Email sent to portfolio owner');

    await transporter.sendMail(userMailOptions);
    console.log('✅ Confirmation email sent to user');

    res.json({ 
      success: true, 
      message: 'Message sent successfully! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    let errorMessage = 'Failed to send message. Please try again later.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email configuration error. Please check email settings.';
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid email address. Please check your email.';
    }
    
    res.status(500).json({ 
      success: false,
      message: errorMessage 
    });
  }
});

// Handle preflight requests
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
});

export default router;