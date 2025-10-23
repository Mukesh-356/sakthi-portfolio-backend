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

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('🔄 Verifying email connection...');
    await transporter.verify();
    console.log('✅ Email server connection successful!');

    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🎉 Portfolio Email Test',
      text: 'Your portfolio email is working!',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('🔑 Authentication failed. Issues:');
      console.log('1. Check if EMAIL_USER is correct:', process.env.EMAIL_USER);
      console.log('2. Check if EMAIL_PASS is 16-character App Password');
      console.log('3. Make sure 2-Factor Authentication is enabled in Gmail');
      console.log('4. App Password should have no spaces');
    } else if (error.code === 'ESOCKET') {
      console.log('🌐 Network connection issue');
    } else {
      console.log('🔍 Other error:', error);
    }
  }
};

testEmail();