import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Create default admin
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'sakthi' });
    if (!adminExists) {
      await User.create({
        username: 'sakthi',
        password: 'sakthi@123'
      });
      console.log('✅ Default admin created: sakthi / sakthi@123');
    } else {
      console.log('✅ Admin already exists: sakthi');
    }
  } catch (error) {
    console.log('❌ Error creating default admin:', error);
  }
};

createDefaultAdmin();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔑 Login attempt:', username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await user.correctPassword(password);
    console.log('🔐 Password check:', isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      console.log('❌ Wrong password for:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful:', username);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.log('❌ Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;