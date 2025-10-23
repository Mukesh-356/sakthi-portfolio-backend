import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import importRoutes from './routes/import.js';

dotenv.config();

const app = express();

// Fix CORS configuration - Add production domains
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'https://sakthipotfolio.com',
    'https://www.sakthipotfolio.com',
    'https://sakthi-portfolio-frontend.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/import', importRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '3D Portfolio Backend is running',
    time: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio Backend is Running!',
    status: 'OK',
    database: 'MongoDB Connected',
    timestamp: new Date()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test API Working!' });
});

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.log('❌ MongoDB Connection Error:', error.message);
    // Don't exit process, just log error
  }
};

// Error handling to prevent crashes
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION:', err.message);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION:', err.message);
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📧 Contact form ready`);
      console.log(`🌐 Frontend: http://localhost:3000`);
      console.log(`🔗 Production URL: https://sakthi-portfolio-backend-production.up.railway.app`);
    });
  } catch (error) {
    console.log('❌ Server startup error:', error.message);
  }
};

startServer();