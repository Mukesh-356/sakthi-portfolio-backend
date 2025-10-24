import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js'; // Make sure this line exists
import importRoutes from './routes/import.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000', 
    'https://sakthi-portfolio-frontend.vercel.app',
    'https://sakthipotfolio.com',
    'https://www.sakthipotfolio.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes - MAKE SURE THIS LINE EXISTS
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes); // ⚠️ THIS IS CRITICAL
app.use('/api/import', importRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Test contact route
app.get('/api/contact-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Contact route test - working!',
    timestamp: new Date().toISOString()
  });
});


// In your server.js, add this:
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// Keep process alive
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, cleaning up...');
  setTimeout(() => process.exit(0), 5000);
});
// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/contact-test', 
      'POST /api/contact',
      'GET /api/contact/test'
    ]
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err.message));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log('📍 Available routes:');
  console.log('   GET  /api/health');
  console.log('   GET  /api/contact-test');
  console.log('   POST /api/contact');
  console.log('   GET  /api/contact/test');
});