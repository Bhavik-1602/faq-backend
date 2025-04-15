const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const faqRoutes = require('./routes/faqRoutes');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();
  
// Initialize app
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ origin: "*" })); // Allow CORS (for frontend/backend connection)
app.use(express.json()); // Parse incoming JSON data

// Routes
app.use('/api/auth', authRoutes); // Register, Login, Change Password
app.use('/api/faq', faqRoutes);   // Add FAQ, List FAQs, Add FAQ Category  

// Base route
app.get('/', (req, res) => {
  res.send('🚀 User & FAQ Management API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
