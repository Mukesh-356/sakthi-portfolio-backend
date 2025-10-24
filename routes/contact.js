// import express from 'express';
// import nodemailer from 'nodemailer';

// const router = express.Router();

// // Test endpoint
// router.get('/test', (req, res) => {
//   console.log('✅ Contact test route hit');
//   res.json({ 
//     success: true, 
//     message: 'Contact route is working!',
//     timestamp: new Date().toISOString(),
//     emailConfigured: !!process.env.EMAIL_USER
//   });
// });

// // Email test endpoint
// router.get('/test-email', async (req, res) => {
//   try {
//     console.log('📧 Testing email configuration...');
    
//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//       return res.status(500).json({
//         success: false,
//         message: 'Email credentials not configured'
//       });
//     }

//     const transporter = nodemailer.createTransport({
//       service: process.env.EMAIL_SERVICE || 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     console.log('🔄 Verifying email transporter...');
//     await transporter.verify();
//     console.log('✅ Email transporter verified');

//     res.json({ 
//       success: true, 
//       message: 'Email configuration is correct',
//       email: process.env.EMAIL_USER
//     });
//   } catch (error) {
//     console.error('❌ Email test failed:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Email configuration error',
//       error: error.message 
//     });
//   }
// });

// // Main contact form submission
// router.post('/', async (req, res) => {
//   try {
//     const { name, email, message, projectDetails } = req.body;

//     console.log('📧 Contact form submission received:', { 
//       name, 
//       email, 
//       message: message?.substring(0, 50) + '...',
//       projectDetails: projectDetails?.substring(0, 50) + '...'
//     });

//     // Validate required fields
//     if (!name || !email || !message) {
//       console.log('❌ Validation failed - missing fields');
//       return res.status(400).json({ 
//         success: false,
//         message: 'Name, email, and message are required fields' 
//       });
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       console.log('❌ Validation failed - invalid email:', email);
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid email address'
//       });
//     }

//     console.log('🔄 Creating email transport...');
    
//     // Enhanced email transporter with timeout
//     const transporter = nodemailer.createTransport({
//       service: process.env.EMAIL_SERVICE || 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       },
//       secure: true,
//       tls: {
//         rejectUnauthorized: false
//       },
//       timeout: 10000 // 10 seconds timeout
//     });

//     // Email to portfolio owner (you)
//     const ownerMailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_USER, // Send to yourself
//       replyTo: email,
//       subject: `🎨 New Portfolio Message - ${name}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1>New Contact Form Submission</h1>
//             <p>From your 3D Portfolio Website</p>
//           </div>
//           <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
//             <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3b82f6;">
//               <h3>👤 Contact Information</h3>
//               <p><strong>Name:</strong> ${name}</p>
//               <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
//               <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
//             </div>
//             ${projectDetails ? `
//             <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #f59e0b;">
//               <h3>📋 Project Details</h3>
//               <p>${projectDetails.replace(/\n/g, '<br>')}</p>
//             </div>
//             ` : ''}
//             <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981;">
//               <h3>💬 Message</h3>
//               <p>${message.replace(/\n/g, '<br>')}</p>
//             </div>
//           </div>
//           <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
//             <p>This message was sent from your portfolio contact form</p>
//           </div>
//         </div>
//       `
//     };

//     // Confirmation email to the user
//     const userMailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: '✅ Message Received - 3D Portfolio',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1>Thank You for Reaching Out! 🎨</h1>
//             <p>Your message has been received</p>
//           </div>
//           <div style="background: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px;">
//             <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981;">
//               <h3>Hello ${name},</h3>
//               <p>Thank you for contacting me through my 3D portfolio website. I have received your message and will review it shortly.</p>
//               <p><strong>What to expect next:</strong></p>
//               <ul>
//                 <li>I typically respond within 6-12 hours</li>
//                 <li>We'll discuss your project requirements</li>
//                 <li>I'll provide a detailed proposal and timeline</li>
//               </ul>
//             </div>
//             <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3b82f6;">
//               <h3>📋 Your Message Summary</h3>
//               <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
//               <p><strong>Message Preview:</strong> "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"</p>
//             </div>
//           </div>
//           <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
//             <p>This is an automated confirmation. Please do not reply to this email.</p>
//           </div>
//         </div>
//       `
//     };

//     console.log('📤 Sending emails...');
    
//     // Send both emails in parallel
//     await Promise.all([
//       transporter.sendMail(ownerMailOptions),
//       transporter.sendMail(userMailOptions)
//     ]);

//     console.log('✅ Emails sent successfully');

//     res.json({ 
//       success: true, 
//       message: 'Message sent successfully! Check your email for confirmation.' 
//     });

//   } catch (error) {
//     console.error('❌ Contact form error:', error);
    
//     let errorMessage = 'Failed to send message. Please try again later.';
    
//     if (error.code === 'EAUTH') {
//       errorMessage = 'Email authentication failed. Please check email configuration.';
//     } else if (error.code === 'EENVELOPE') {
//       errorMessage = 'Invalid email address. Please check your email.';
//     } else if (error.message.includes('Invalid login')) {
//       errorMessage = 'Email service configuration error. Please check credentials.';
//     } else if (error.message.includes('Timeout')) {
//       errorMessage = 'Email service is taking too long to respond. Please try again later.';
//     }
    
//     res.status(500).json({ 
//       success: false,
//       message: errorMessage,
//       debug: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// export default router;



import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  console.log('✅ Contact test route hit');
  res.json({ 
    success: true, 
    message: 'Contact route is working!',
    timestamp: new Date().toISOString(),
    emailConfigured: !!process.env.EMAIL_USER
  });
});

// Email test endpoint
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
      service: process.env.EMAIL_SERVICE || 'gmail',
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

// 🚀 OPTIMIZED CONTACT FORM - INSTANT RESPONSE
router.post('/', async (req, res) => {
  try {
    const { name, email, message, projectDetails } = req.body;

    console.log('📧 Contact form submission received');

    // Quick validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, email, and message are required fields' 
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

    // ✅ INSTANT RESPONSE - Don't wait for email
    console.log('✅ Sending instant response to user');
    res.json({ 
      success: true, 
      message: 'Message received successfully! We will contact you within 24 hours.' 
    });

    // ✅ SEND EMAIL IN BACKGROUND (Non-blocking)
    setTimeout(async () => {
      try {
        console.log('🔄 Starting background email process...');
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          timeout: 15000 // 15 second timeout for email only
        });

        // ✅ SEND ONLY ONE EMAIL (To yourself) - Much faster
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          replyTo: email,
          subject: `📧 New Contact: ${name}`,
          text: `
NEW CONTACT FORM SUBMISSION

Name: ${name}
Email: ${email}
Message: ${message}
${projectDetails ? `Project Details: ${projectDetails}` : ''}

Timestamp: ${new Date().toLocaleString()}
          `
        };

        console.log('📤 Sending background email...');
        await transporter.sendMail(mailOptions);
        console.log('✅ Background email sent successfully');

      } catch (emailError) {
        console.error('❌ Background email failed (non-critical):', emailError.message);
        // Don't affect user experience
      }
    }, 100); // Small delay to ensure response is sent first

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    // ✅ ALWAYS RETURN SUCCESS TO USER
    res.json({ 
      success: true, 
      message: 'Message received! We will contact you soon.' 
    });
  }
});

export default router;