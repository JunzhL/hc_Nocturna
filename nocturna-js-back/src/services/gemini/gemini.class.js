// services/gemini/gemini.class.js

const { Service } = require('feathers-mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// A Feathers service that calls the Gemini model.
class GeminiService extends Service {
  /**
   * Feathers calls `create(data, params)` when you do a POST to /gemini
   * or app.service('gemini').create(...)
   */
  async create(data, params) {
    const { prompt } = data;
    if (!prompt) {
      throw new Error('Missing "prompt" in request data');
    }

    try {
      // Initialize the Gemini client with your API key
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY in environment');
      }
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

      // Use your chosen model, e.g. "gemini-1.5-flash"
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Generate content
      const result = await model.generateContent(prompt);

      // The library might return a response stream-like object
      // If so, we can parse it as text:
      const text = await result.response.text();

      // You can store in Mongo if you like:
      // const doc = { prompt, text, createdAt: new Date() };
      // await this.Model.insertOne(doc);

      // Return the text to the client
      return { text };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Gemini API error');
    }
  }
}

module.exports = function (db) {
  // The `Model` is the MongoDB collection you want to store data in
  // If you don't need to store anything, you can still pass a dummy collection
  return new GeminiService({
    Model: db.collection('geminiCollection')
  });
};
