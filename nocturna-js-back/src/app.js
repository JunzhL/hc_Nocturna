const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const { MongoClient } = require('mongodb');

// Create an Express-Feathers app
const app = express(feathers());

// Load app configuration (from config/default.json)
app.configure(configuration());

// Parse HTTP JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up REST API handling
app.configure(express.rest());

// // (Optional) Set up real-time channels
// app.configure(require('./channels'));



// Connect to MongoDB using the connection string from configuration
MongoClient.connect(app.get('mongodb'), { useUnifiedTopology: true })
  .then(client => {
    const db = client.db();

    // Register File Upload Service using the "fileUploads" collection
    app.use('/file-upload', require('./services/file-upload/file-upload.class')(db));

    // Register Information Upload Service
    app.use('/information-upload', require('./services/information-upload/information-upload.class')(db));

    // Register Gemini Service
    app.use('/gemini', require('./services/gemini/gemini.class')(db));

    // Apply hooks for each service
    app.service('file-upload').hooks(require('./services/file-upload/file-upload.hooks'));
    app.service('information-upload').hooks(require('./services/information-upload/information-upload.hooks'));
    app.service('gemini').hooks(require('./services/gemini/gemini.hooks')); // If you have gemini.hooks.js

    // Start the server
    const port = app.get('port') || 3030;
    app.listen(port, () => {
      console.log(`Feathers application started on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
