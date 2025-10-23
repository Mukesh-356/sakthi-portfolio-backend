


import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log('📧 Contact form submission received:', { name, email });

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    console.log('🔄 Creating email transport...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email to portfolio owner (you)
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `🎨 New Portfolio Message - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Contact Form Submission</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
        </div>
      `
    };

    // Confirmation email to the user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Message Received - 3D Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Thank You for Reaching Out! 🎨</h2>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px;">
            <p><strong>Hello ${name},</strong></p>
            <p>Thank you for contacting me. I have received your message and will get back to you within 24 hours.</p>
          </div>
        </div>
      `
    };

    console.log('📤 Sending emails...');
    await transporter.sendMail(ownerMailOptions);
    console.log('✅ Email sent to portfolio owner');

    await transporter.sendMail(userMailOptions);
    console.log('✅ Confirmation email sent to user');

    // Send proper response with headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! You will receive a confirmation email shortly.' 
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    // Send proper error response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

export default router;