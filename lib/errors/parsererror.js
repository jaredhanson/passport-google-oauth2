/**
 * `ParserError` error.
 *
 * @constructor
 * @param {string} [message]
 * @param {string} [code]
 * @access public
 */
function ParserError(message, code) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'ParserError';
    this.message = message;
    this.code = code;
  }
  
  // Inherit from `Error`.
  ParserError.prototype.__proto__ = Error.prototype;
  
  
  // Expose constructor.
  module.exports = ParserError;
  