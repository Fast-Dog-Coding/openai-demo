require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3500;
const { generateDescription, generateTags, generateImage } = require('./controllers/openai');
const { debugLog } = require('./utils');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes

/**
 * Generates a description for a video from a title.
 */
app.post('/api/description', async (req, res) => {
  const { title } = req.body;
  const description = await generateDescription(title);
  res
    .status(200)
    .json({ description });
});

/**
 * Generates a set of five tags for a video from a title.
 */
app.post('/api/tags', async (req, res) => {
  const { title } = req.body;
  const tags = await generateTags(title);
  res
    .status(200)
    .json({ tags });
});

/**
 * Generates a description and a set of five tags for a video from a title.
 */
app.post('/api/meta', async (req, res) => {
  const { title } = req.body;
  const description = await generateDescription(title);
  const tags = await generateTags(title) ;
  res
    .status(200)
    .json({ description, tags });
});

/**
 * Generates a thumbnail image for a video from a description.
 */
app.post('/api/image', async (req, res) => {
  const { prompt } = req.body;
  const url = await generateImage(prompt);
  res
    .status(200)
    .json({ url });
});

// Error handler middleware for unhandled errors
app.use((err, req, res, next) => {
  // Set the default status code to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Log the error
  debugLog(JSON.stringify(err.stack), true);

  // Send a generic error message in production to avoid exposing sensitive information
  const error = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

  // Send the response with the appropriate status code and error message
  res
    .status(statusCode)
    .json({ error });
});

// start server
app.listen(port, () => {
  debugLog(`Listening on port ${port}`, true);
});
