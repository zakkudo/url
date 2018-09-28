/**
 * @module @zakkudo/url
 */

import QueryString from '@zakkudo/query-string';
import UrlError from './UrlError';

/**
 * @private
 * @param {String} url - The url
 * @return {Array} The url/params object
 */
function parse(url, unsafe) {
    const [_url, _params] = url.split('?');

    return [_url, JSON.parse(JSON.stringify(new QueryString(_params, {unsafe})))];
}

/**
 * @private
 * @param {String} url - The url
 */
function createDuplicateQueryError(url) {
    return new UrlError('Trying to add duplicate query param when already exists', url);
}

/**
 *
 * @throws {module:@zakkudo/url/UrlError~UrlError} On issues during serialization or construction of the url
 * @throws {module:@zakkudo/url/QueryStringError~QueryStringError} On issues
 * during serialization or construction of the query string
 */
class Url {
    /**
     * @param {String} url - The url pattern
     * @param {Object} [params] - Params to interpolate or append to the url as a query string when serialized.
     * @param {Object} [options] - Modifiers for how the query string object is contructed
     * @param {Boolean} [options.unsafe = false] - Disable url escaping of
     * key/value pairs. Useful for servers that use unsafe characters as delimiters
     */
    constructor(url, params = {}, options = {}) {
        const unsafe = options.unsafe;

        if (url.includes('?')) {
            if (Object.keys(params).length || url.indexOf('?') !== url.lastIndexOf('?')) {
                throw createDuplicateQueryError(url);
            }

            const [_url, _params] = parse(url, unsafe);

            this.params = new QueryString(_params, {unsafe});
            this.base = _url;
        } else {
            this.params = new QueryString(params, {unsafe});
            this.base = url;
        }
    }

    /**
     * Stringifies the current url settings
     * @private
     * @return {String} The string form of the url
     */
    toString() {
        const pattern = /\/(:[^/]+)/g;
        // Makes a copy of the query string because we modify it for serialization
        const query = new QueryString(this.params);

        const url = this.base.replace(pattern, (m, match) => {
            const key = match.substring(1);
            const param = query[key];

            if (query.hasOwnProperty(key) && param !== undefined) {
                delete query[key];

                return String(`/${param}`);
            }

            throw new UrlError(`No replacement exists for ${match} in the params`, this.base);
        });

        const queryAsString = String(query);

        if (url.includes('?') && queryAsString.length) {
            throw new UrlError(
                'Trying to add duplicate query param when already exists', this.base
            );
        }

        return `${url}${queryAsString}`;
    }
}

export default Url;
