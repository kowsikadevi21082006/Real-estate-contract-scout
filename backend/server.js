const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        // Optional: process.exit(1); // Keep running to allow diagnosis
    });

// Routes
const uploadRoutes = require('./routes/upload');
const searchRoutes = require('./routes/search');
const extractionRoutes = require('./routes/extraction');
const documentRoutes = require('./routes/documents');

app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/extract', extractionRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
    res.send('Contract Scout API Running');
});

app.get('/api/health', (req, res) => {
    res.json({ status: "ok", time: new Date() });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
