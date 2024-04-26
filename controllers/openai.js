const openai = require("../config/openai");
const {
  debugLog,
  debugDir
} = require('../utils');
const OPEN_AI_MAX_TOKENS = 100;
const OPEN_AI_NUM_IMAGES = 1;
const OPEN_AI_MODEL_CHAT = 'gpt-3.5-turbo';
const OPEN_AI_MODEL_IMAGE = 'dall-e-3'; // 'dall-e-2';
const OPEN_AI_MODEL_SIZE = '1024x1024'; // '512x512';

/**
 *
 * @param message
 * @return {Promise<ChatCompletion.Choice>}
 */
async function chat(message) {
  debugLog(`chat message: ${message}`);

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message },
    ],
    model: OPEN_AI_MODEL_CHAT,
    max_tokens: OPEN_AI_MAX_TOKENS
  });

  debugDir(completion);

  return completion.choices[0];
}

/**
 *
 * @param prompt
 * @return {Promise<Image>}
 */
async function image(prompt) {
  debugLog(`image prompt: ${prompt}`);

  const image = await openai.images.generate({
    prompt,
    n: OPEN_AI_NUM_IMAGES,
    model: OPEN_AI_MODEL_IMAGE,
    size: OPEN_AI_MODEL_SIZE
  });

  debugDir(image);

  return image.data[0];
}

/**
 *
 * @param title
 * @return {Promise<ChatCompletionMessage>}
 */
async function generateDescription(title){
  debugLog(`generateDescription title: ${title}`);
  const prompt = `generate a description for a YouTube video called, "${title}"`;
  const response =  await chat(prompt);

  return response.message;
}

/**
 *
 * @param title
 * @return {Promise<ChatCompletionMessage>}
 */
async function generateTags(title){
  debugLog(`generateTags title: ${title}`);
  const prompt = `generate 5 keywords for a YouTube video called, "${title}"`;
  const response =  await chat(prompt);

  return response.message;
}

/**
 *
 * @param prompt
 * @return {Promise<string>}
 */
async function generateImage(prompt){
  debugLog(`generateImage title: ${prompt}`);
  const response = await image(prompt);
  return response.url;
}

module.exports = { generateDescription, generateTags, generateImage }
