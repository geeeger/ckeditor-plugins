/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env browser */

'use strict';

import mix from '@ckeditor/ckeditor5-utils/src/mix';
import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin';

const DEFAULT_OPTIONS = {
    method: 'GET',
    data: null
}

/**
 * Class representing the token used for communication with CKEditor Cloud Services.
 * Value of the token is retrieving from the specified URL and is refreshed every 1 hour by default.
 *
 * @mixes ObservableMixin
 */
class Token {
    /**
     * Creates `Token` instance.
     * Method `init` should be called after using the constructor or use `create` method instead.
     *
     * @param {String} tokenUrl Endpoint address to download the token.
     * @param {Object} options
     * @param {String} [options.initValue] Initial value of the token.
     * @param {Number} [options.refreshInterval=3600000] Delay between refreshes. Default 1 hour.
     * @param {Boolean} [options.autoRefresh=true] Specifies whether to start the refresh automatically.
     */
    constructor( url, options = {}) {
        if ( !url ) {
            throw new Error( '`url` must be provided' );
        }

        /**
         * @type {String}
         * @private
         */
        this._url = url;

        this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    }

    /**
     * Initializes the token.
     *
     * @returns {Promise.<Token>}
     */
    init() {
        return new Promise( ( resolve, reject ) => {
            if ( !this.value ) {
                this._refreshToken()
                    .then( resolve )
                    .catch( reject );
            }
            else {
                resolve( this );
            }
        } );
    }

    /**
     * Gets the new token.
     *
     * @protected
     * @returns {Promise.<Token>}
     */
    _refreshToken() {
        return new Promise( ( resolve, reject ) => {
            const xhr = new XMLHttpRequest();
            let opts = this.options;
            if ( opts.withCredentials && 'withCredentials' in xhr ) {
                xhr.open( opts.method, this._url, true );
                xhr.withCredentials = true;
            } else {
                xhr.open( opts.method, this._url );
            }

            if (opts.headers) {
                for (let key in opts.headers) {
                    if (opts.headers.hasOwnProperty(key)) {
                        xhr.setRequestHeader(key, opts.headers[key]);
                    }
                }
            }

            xhr.addEventListener( 'load', () => {
                const statusCode = xhr.status;
                const xhrResponse = xhr.response;

                if ( statusCode < 200 || statusCode > 299 ) {
                    return reject( new Error('requist failed! url:' + this._url) );
                }

                this.set( 'value', xhrResponse );

                return resolve( this );
            } );

            xhr.addEventListener( 'error', () => reject( new Error('Network Error') ) );
            xhr.addEventListener( 'abort', () => reject( new Error('Abort') ) );

            xhr.send(opts.data);
        } );
    }

    /**
     * Creates a initialized {@link Token} instance.
     *
     * @param {String} tokenUrl Endpoint address to download the token.
     * @param {Object} options
     * @param {String} [options.initValue] Initial value of the token.
     * @param {Number} [options.refreshInterval=3600000] Delay between refreshes. Default 1 hour.
     * @param {Boolean} [options.autoRefresh=true] Specifies whether to start the refresh automatically.
     * @returns {Promise.<Token>}
     */
    static create( url, options ) {
        const token = new Token( url, options );

        return token.init();
    }
}

mix( Token, ObservableMixin );

export default Token;
