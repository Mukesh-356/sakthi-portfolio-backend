import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  try {
    console.log('🔧 Testing email configuration...');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass exists:', !!process.env.EMAIL_PASS);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Email credentials missing in .env file');
      return;
    }

    console.log('🔄 Creating email transport...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('🔐 Verifying email connection...');
    await transporter.verify();
    console.log('✅ Email server connection successful!');

    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🎉 Portfolio Email Test - SUCCESS!',
      text: 'Congratulations! Your portfolio email is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8fafc;">
          <h2 style="color: #10b981;">✅ Email Test Successful!</h2>
          <p>Your portfolio contact form is now ready to send emails.</p>
          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Timestamp:</strong> ${new Date().toString()}</p>
            <p><strong>Email:</strong> ${process.env.EMAIL_USER}</p>
          </div>
          <p style="color: #64748b;">You can now test the contact form on your website.</p>
        </div>
      `
    };

    console.log('📤 Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('👤 From:', process.env.EMAIL_USER);
    console.log('👥 To:', process.env.EMAIL_USER);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 AUTHENTICATION FAILED');
      console.log('Your App Password might not be working.');
      console.log('Try generating a new App Password without underscores.');
      
    } else {
      console.log('🔍 Error details:', error);
    }
  }
};

testEmail();