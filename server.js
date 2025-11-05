import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import authRoutes from './routes/auth.js'; // ADD BACK AUTH ROUTES

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
    'https://www.sakthipotfolio.com',
    'https://sakthi-portfolio-frontend-ikb9jmqx9-mukesh-356s-projects.vercel.app',
    'https://*.vercel.app',
    'https://sakthi-portfolio-frontend-*.vercel.app',
    'https://artin3d.fun',
    'https://www.artin3d.fun'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`🌐 Origin: ${req.headers.origin}`);
  next();
});

// Routes - ADD AUTH ROUTES BACK
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes); // 🔥 ADD THIS BACK

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy - Auth enabled',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: 'enabled',
    features: {
      projects: 'enabled',
      contact: 'emailjs', 
      auth: 'enabled' // 🔥 AUTH ENABLED
    }
  });
});

// Test route
app.get('/api/contact-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Contact uses EmailJS - Auth system active',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    cors: 'configured',
    features: 'Projects + Auth APIs - Contact uses EmailJS'
  });
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
      'GET /api/projects',
      'POST /api/projects',
      'POST /api/auth/login' // 🔥 AUTH ROUTE ADDED
    ]
  });
});

// 🔥 FIXED MONGODB CONNECTION
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => {
  console.log('❌ MongoDB Connection Error:', err.message);
  console.log('💡 MONGODB_URI:', MONGODB_URI ? 'Set' : 'Missing');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log('📍 CORS Enabled for Vercel domains');
  console.log('📍 Available routes:');
  console.log('   GET  /api/health');
  console.log('   GET  /api/contact-test');
  console.log('   GET  /api/projects'); 
  console.log('   POST /api/projects');
  console.log('   POST /api/auth/login'); // 🔥 AUTH ADDED
  console.log('📍 Contact: EmailJS');
  console.log('📍 Auth: Enabled with MongoDB');
});

// Keep-alive for Railway
setInterval(() => {
  console.log('💓 Keep-alive heartbeat:', new Date().toISOString());
}, 25000);

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received - Keeping alive for 30 seconds...');
  setTimeout(() => {
    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  }, 30000);
});