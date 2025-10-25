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

// // 🚀 OPTIMIZED CONTACT FORM - INSTANT RESPONSE
// router.post('/', async (req, res) => {
//   try {
//     const { name, email, message, projectDetails } = req.body;

//     console.log('📧 Contact form submission received');

//     // Quick validation
//     if (!name || !email || !message) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Name, email, and message are required fields' 
//       });
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid email address'
//       });
//     }

//     // ✅ INSTANT RESPONSE - Don't wait for email
//     console.log('✅ Sending instant response to user');
//     res.json({ 
//       success: true, 
//       message: 'Message received successfully! We will contact you within 24 hours.' 
//     });

//     // ✅ SEND EMAIL IN BACKGROUND (Non-blocking)
//     setTimeout(async () => {
//       try {
//         console.log('🔄 Starting background email process...');
        
//         const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//           },
//           timeout: 15000 // 15 second timeout for email only
//         });

//         // ✅ SEND ONLY ONE EMAIL (To yourself) - Much faster
//         const mailOptions = {
//           from: process.env.EMAIL_USER,
//           to: process.env.EMAIL_USER,
//           replyTo: email,
//           subject: `📧 New Contact: ${name}`,
//           text: `
// NEW CONTACT FORM SUBMISSION

// Name: ${name}
// Email: ${email}
// Message: ${message}
// ${projectDetails ? `Project Details: ${projectDetails}` : ''}

// Timestamp: ${new Date().toLocaleString()}
//           `
//         };

//         console.log('📤 Sending background email...');
//         await transporter.sendMail(mailOptions);
//         console.log('✅ Background email sent successfully');

//       } catch (emailError) {
//         console.error('❌ Background email failed (non-critical):', emailError.message);
//         // Don't affect user experience
//       }
//     }, 100); // Small delay to ensure response is sent first

//   } catch (error) {
//     console.error('❌ Contact form error:', error);
    
//     // ✅ ALWAYS RETURN SUCCESS TO USER
//     res.json({ 
//       success: true, 
//       message: 'Message received! We will contact you soon.' 
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

// 🚀 DEBUG CONTACT FORM - WITH DETAILED LOGGING
router.post('/', async (req, res) => {
  try {
    const { name, email, message, projectDetails } = req.body;

    console.log('🔍 DEBUG - Contact form submission received');
    console.log('📧 ENVIRONMENT VARIABLES CHECK:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ SET' : '❌ NOT SET');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? `✅ SET (length: ${process.env.EMAIL_PASS.length})` : '❌ NOT SET');
    console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)');

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
        console.log('📧 Creating email transporter...');
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          timeout: 15000
        });

        console.log('✅ Email transporter created');
        console.log('🔧 Verifying transporter configuration...');
        
        await transporter.verify();
        console.log('✅ Transporter verified successfully');

        // ✅ SEND ONLY ONE EMAIL (To yourself)
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
          `,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
            ${projectDetails ? `<p><strong>Project Details:</strong> ${projectDetails}</p>` : ''}
            <p><em>Received: ${new Date().toLocaleString()}</em></p>
          `
        };

        console.log('📤 Attempting to send email...');
        console.log('From:', process.env.EMAIL_USER);
        console.log('To:', process.env.EMAIL_USER);
        console.log('Subject:', `📧 New Contact: ${name}`);
        
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ BACKGROUND EMAIL SENT SUCCESSFULLY!');
        console.log('Message ID:', result.messageId);
        console.log('Response:', result.response);

      } catch (emailError) {
        console.error('❌ BACKGROUND EMAIL FAILED:');
        console.error('Error message:', emailError.message);
        console.error('Error code:', emailError.code);
        console.error('Full error:', emailError);
        
        if (emailError.code === 'EAUTH') {
          console.error('🔐 AUTHENTICATION FAILED - Check email credentials');
        } else if (emailError.code === 'ECONNECTION') {
          console.error('🌐 CONNECTION FAILED - Network issue');
        } else if (emailError.code === 'ETIMEDOUT') {
          console.error('⏰ TIMEOUT - Email service too slow');
        }
      }
    }, 100);

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