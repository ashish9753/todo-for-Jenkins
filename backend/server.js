// webhook test - automatic trigger

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();

// test - 2nd webhook trigger check
// test - 3nd webhook trigger check

const todoRoutes = require('./routes/todos.js');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Health Check - Jenkins will use this 
app.get('/health', (req, res) => {
    res.json({status : 'ok'})
})

// Connect with mongodb

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5001, () => {
        console.log(`Server is running on port http://localhost:${process.env.PORT}...`);
    });
})
.catch( err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
})