import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import importRoutes from './routes/import.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// CORS configuration - FIXED
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000', 
    'https://sakthi-portfolio-frontend.vercel.app',
    'https://sakthipotfolio.com',
    'https://www.sakthipotfolio.com',
    'https://sakthi-portfolio-frontend-ikb9jmqx9-mukesh-356s-projects.vercel.app', // ADD THIS
    'https://*.vercel.app', // ALL VERCEL DOMAINS
    'https://sakthi-portfolio-frontend-*.vercel.app' // WILDCARD FOR ALL PREVIEW DEPLOYMENTS
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware with CORS info
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`🌐 Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/import', importRoutes);
app.use('/api/auth', authRoutes);

// Health check with CORS headers
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: 'enabled'
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    cors: 'configured'
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
  console.log('📍 CORS Enabled for:');
  console.log('   - https://sakthi-portfolio-frontend-ikb9jmqx9-mukesh-356s-projects.vercel.app');
  console.log('   - https://sakthi-portfolio-frontend.vercel.app');
  console.log('   - https://*.vercel.app');
  console.log('📍 Available routes:');
  console.log('   GET  /api/health');
  console.log('   GET  /api/contact-test');
  console.log('   POST /api/contact');
  console.log('   GET  /api/contact/test');
});

// 🚨 CRITICAL: KEEP-ALIVE FOR RAILWAY
console.log('🚀 Server startup complete - Adding keep-alive...');

// Railway idle detection prevent - heartbeat every 25 seconds
setInterval(() => {
  console.log('💓 Keep-alive heartbeat:', new Date().toISOString());
}, 25000);

// Better SIGTERM handling - keep alive longer
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received - Keeping alive for 30 seconds...');
  setTimeout(() => {
    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  }, 30000);
});

// Additional keep-alive: Self-ping every 2 minutes
setInterval(() => {
  fetch(`http://localhost:${PORT}/api/health`)
    .then(() => console.log('🔗 Self-ping successful'))
    .catch(() => console.log('⚠️ Self-ping failed'));
}, 120000);