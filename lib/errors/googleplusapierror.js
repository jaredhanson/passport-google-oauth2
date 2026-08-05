/**
 * `GooglePlusAPIError` error.
 *
 * References:
 *   - https://developers.google.com/+/web/api/rest/
 *
 * @constructor
 * @param {string} [message]
 * @param {number} [code]
 * @access public
 */
function GooglePlusAPIError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'GooglePlusAPIError';
  this.message = message;
  this.code = code;
}

// Inherit from `Error`.
Object.setPrototypeOf(GooglePlusAPIError.prototype, Error.prototype);


// Expose constructor.
module.exports = GooglePlusAPIError;
