const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// --- FIXED CORS CONFIGURATION ---
app.use(cors({
  origin: [
    'https://ayodhyaestate.com',
    'http://ayodhyaestate.com',
    'https://www.ayodhyaestate.com',
    'http://www.ayodhyaestate.com',
    'https://ayodhyaestates.netlify.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
// -----------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/inquiry', require('./routes/inquiry'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🕉️  Ayodhya Estate Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
