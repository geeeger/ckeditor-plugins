/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module font/utils
 */

/**
 * Builds a proper {@link module:engine/conversion/conversion~ConverterDefinition converter definition} out of input data.
 *
 * @param {String} modelAttributeKey Key
 * @param {Array.<module:font/fontfamily~FontFamilyOption>|Array.<module:font/fontsize~FontSizeOption>} options
 * @returns {module:engine/conversion/conversion~ConverterDefinition}
 */
export function buildDefinition( modelAttributeKey, options ) {
    const definition = {
        model: {
            key: modelAttributeKey,
            values: []
        },
        view: {},
        upcastAlso: {}
    };

    for ( const option of options ) {
        definition.model.values.push( option.model );
        definition.view[ option.model ] = option.view;

        if ( option.upcastAlso ) {
            definition.upcastAlso[ option.model ] = option.upcastAlso;
        }
    }

    return definition;
}

export function buildParams(url, options) {
    let r = url.split('?');
    let u = r[0];
    let p = (r[1] || '').split('&')
    let o = {};
    p.forEach(function (item) {
        if (item) {
            let f = item.split('=');
            o[f[0]] = f[1] || '';
        }
    })

    let opts = Object.assign({}, o, options);
    let e = [];

    for (let key in opts) {
        if (opts.hasOwnProperty(key)) {
            e.push(`${key}=${opts[key]}`)
        }
    }
    return u + '?' + e.join('&');
}

export function hashString( str ) {
    var hash = 0,
        i = 0,
        len = str.length,
        _char;

    for ( ; i < len; i++ ) {
        _char = str.charCodeAt( i );
        hash = _char + (hash << 6) + (hash << 16) - hash;
    }

    return hash;
}
