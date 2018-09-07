/**
 * @module @zakkudo/url/UrlError
 */

/**
 * Error class used by Url for raising errors generated
 * for invalid errors.
 * @extends Error
 */
class UrlError extends Error {
    /**
     * @param {String} message - A message describing the reason for the error.
     * @param {String} url - The related url fragment when the error was generated
     */
    constructor(message, url) {
        super(`${message} <${url}>`);
        this.url = url;
    }

    /**
     * @private
     */
    toString() {
        return `UrlError: ${this.message}`;
    }
}

export default UrlError;
