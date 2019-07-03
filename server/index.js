const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const keys = require('../config/keys');
const { Schema } = mongoose;

const app = express();

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
require('./routes/userRoutes')(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`) );

