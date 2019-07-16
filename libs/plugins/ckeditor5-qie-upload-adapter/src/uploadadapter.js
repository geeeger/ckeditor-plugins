/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals XMLHttpRequest, FormData */

/**
 * @module adapter-ckfinder/uploadadapter
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

export default class QieUploadAdapter extends Plugin {
    static get requires() {
        return [ FileRepository ];
    }

    static get pluginName() {
        return 'QieUploadAdapter';
    }

    init() {
        console.log('init')
        const url = this.editor.config.get( 'qieUploader.uploadUrl' );

        if ( !url ) {
            return;
        }

        // Register
        this.editor.plugins.get( FileRepository ).createUploadAdapter = loader => new UploadAdapter( loader, url, this.editor.t );
    }
}

class UploadAdapter {
    constructor( loader, url, t ) {
        this.loader = loader;
        this.url = url;
        this.t = t;

    }

    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                this._initRequest();
                this._initListeners( resolve, reject );
                this._sendRequest(file);
            } ) );
    }

    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open( 'POST', this.url, true );
        xhr.responseType = 'json';
    }

    _initListeners( resolve, reject ) {
        const xhr = this.xhr;
        const loader = this.loader;
        const t = this.t;
        const genericError = t( 'Cannot upload file:' ) + ` ${ loader.file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericError ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            const response = xhr.response;

            if ( !response || response.error !== 0 ) {
                return reject( response && response.error && response.message ? response.message : genericError );
            }

            resolve( {
                default: response.url
            } );
        } );

        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    _sendRequest(file) {
        const data = new FormData();
        data.append('fileField', file);
        this.xhr.send( data );
    }
}
