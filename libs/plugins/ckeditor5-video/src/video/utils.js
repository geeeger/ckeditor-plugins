/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/image/utils
 */

import { toWidget, isWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';

const videoSymbol = Symbol( 'isVideo' );

/**
 * Converts a given {@link module:engine/view/element~Element} to an image widget:
 * * Adds a {@link module:engine/view/element~Element#_setCustomProperty custom property} allowing to recognize the image widget element.
 * * Calls the {@link module:widget/utils~toWidget} function with the proper element's label creator.
 *
 * @param {module:engine/view/element~Element} viewElement
 * @param {module:engine/view/writer~Writer} writer An instance of the view writer.
 * @param {String} label The element's label. It will be concatenated with the image `alt` attribute if one is present.
 * @returns {module:engine/view/element~Element}
 */
export function toVideoWidget( viewElement, writer, label ) {
    writer.setCustomProperty( videoSymbol, true, viewElement );

    return toWidget( viewElement, writer, { label: labelCreator } );

    function labelCreator() {
        const videoElement = viewElement.getChild( 0 );
        const altText = videoElement.getAttribute( 'alt' );

        return altText ? `${ altText } ${ label }` : label;
    }
}

/**
 * Checks if a given view element is an image widget.
 *
 * @param {module:engine/view/element~Element} viewElement
 * @returns {Boolean}
 */
export function isVideoWidget( viewElement ) {
    return !!viewElement.getCustomProperty( videoSymbol ) && isWidget( viewElement );
}

/**
 * Checks if an image widget is the only selected element.
 *
 * @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
 * @returns {Boolean}
 */
export function isVideoWidgetSelected( selection ) {
    const viewElement = selection.getSelectedElement();

    return !!( viewElement && isVideoWidget( viewElement ) );
}

/**
 * Checks if the provided model element is an instance of {@link module:engine/model/element~Element Element} and its name
 * is `image`.
 *
 * @param {module:engine/model/element~Element} modelElement
 * @returns {Boolean}
 */
export function isVideo( modelElement ) {
    return modelElement instanceof ModelElement && modelElement.name == 'video';
}
