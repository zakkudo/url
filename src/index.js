import QueryString from '@zakkudo/query-string';
import UrlError from './UrlError';

/**
 * @private
 * @param {String} url - The url
 * @return {Array} The url/params object
 */
function parse(url) {
    const [_url, _params] = url.split('?');

    return [_url, JSON.parse(JSON.stringify(new QueryString(_params)))];
}

/**
 * @private
 * @param {String} url - The url
 */
function createDuplicateQueryError(url) {
    return new UrlError('Trying to add duplicate query param when already exists', url);
}

/**
 * Make working with urls enjoyable.
 *
 * Why use this?
 *
 * - Params are accepted as a separate object
 * - You can update the params on the fly before the string is serialized
 * - Supports interpolation of fragments of the url with the params
 * - Supports dynamic json stringification of complex options like `@zakkudo/query-string`
 *
 * Install with:
 *
 * ```console
 * yarn add @zakkudo/url
 * ```
 *
 * @example <caption>Generate URL with interpolation</caption>
 * import Url from '@zakkudo/url';
 *
 * const url = new Url('http://backend/v1/users/:id/detail', {
 *   page: 3,
 *   id: '1234'
 * });
 *
 * String(url); // 'http://backend/v1/users/1234/detail?page=3'
 * url.toString(); // 'http://backend/v1/users/1234/detail?page=3'
 *
 * //Update the params after the fact
 *
 * url.param.id = '5678';
 *
 * String(url); // 'http://backend/v1/users/5678/detail?page=3'
 *
 * @throws {UrlError} On issues during serialization or construction of the url
 * @throws {QueryStringError} On issues during serialization or construction of the query string
 * @module Url
 */
export default class Url {
    /**
     * @param {String} url - The url pattern
     * @param {Object} params - Params to interpolate or append to the url when serialized to a string.
     */
    constructor(url, params = {}) {
        if (url.includes('?')) {
            if (Object.keys(params).length || url.indexOf('?') !== url.lastIndexOf('?')) {
                throw createDuplicateQueryError(url);
            }

            const [_url, _params] = parse(url);

            this.params = _params;
            this.base = _url;
        } else {
            this.params = params;
            this.base = url;
        }
    }

    /**
     * Stringifies the current url settings
     * @return {String} The string form of the url
     */
    toString() {
        const pattern = /\/(:[^/]+)/g;
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
            throw new UrlError('Trying to add duplicate query param when already exists', this.base);
        }

        return `${url}${queryAsString}`;
    }
}
