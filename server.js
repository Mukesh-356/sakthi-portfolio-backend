import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Basic CORS - Allow all for now
app.use(cors());
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

// MongoDB Connection only - NO OTHER IMPORTS
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err.message));

// No error handlers that might interfere
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Server started successfully`);
});