import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Updated CORS with your frontend URL
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000', 
    'https://sakthi-portfolio-frontend.vercel.app',
    'https://sakthipotfolio.com',
    'https://www.sakthipotfolio.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Simple test routes only
app.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio Backend is Running!',
    status: 'OK',
    timestamp: new Date()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    time: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test API Working!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err.message));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Server started successfully`);
  console.log(`🌐 Frontend: https://sakthi-portfolio-frontend.vercel.app`);
});