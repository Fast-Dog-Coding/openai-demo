/**
 * Logs a debug message to the console with a timestamp, caller's information,
 * and message. By default, does not log in production.
 *
 * @param {string} message The message to log.
 * @param {boolean} [logInProduction=false] Whether to log the message in production.
 *   If set to true, the message will be logged even in production.
 * @returns {void}
 */
function debugLog(message, logInProduction = false) {
  if (process.env.NODE_ENV === 'production' && !logInProduction) {
    return;
  }

  // Get the current date and time
  const timestamp = new Date().toISOString();

  // Get the caller's filename, function name, and line number
  const stackTrace = new Error().stack.split('\n')[2];
  const [, caller] = /\s+at\s+(.*)/.exec(stackTrace);

  // Log the message with the timestamp, caller, and message
  console.log(`[${timestamp}] [${caller}] ${message}`);
}

/**
 * Logs an object to the console by stringifying it to JSON format.
 *
 * @param {Object} obj The object to log.
 * @param {boolean} [logInProduction=false] Whether to log the object in production.
 *   If set to true, the object will be logged even in production.
 * @returns {void}
 */
function debugDir(obj, logInProduction = false) {
  debugLog(JSON.stringify(obj), logInProduction);
}

module.exports = { debugDir, debugLog };
