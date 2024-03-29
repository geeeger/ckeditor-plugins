/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module block-quote/blockquoteediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import BlockQuoteCommand from './blockquotecommand';
import { downcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { upcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';


/**
 * The block quote editing.
 *
 * Introduces the `'blockQuote'` command and the `'blockQuote'` model element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BlockQuoteEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;

		editor.commands.add( 'blockQuote', new BlockQuoteCommand( editor ) );

		schema.register( 'blockQuote', {
			allowWhere: '$block',
			allowContentOf: '$root'
		} );

		// Disallow blockQuote in blockQuote.
		schema.addChildCheck( ( ctx, childDef ) => {
			if ( ctx.endsWith( 'blockQuote' ) && childDef.name == 'blockQuote' ) {
				return false;
			}
		} );

		// upcast downcast elementToElement并不能共用一套mv姿势，所以下面的写法有问题
		editor.conversion.elementToElement( { model: 'blockQuote', view: {
			name: 'blockquote',
			styles: {
				'border-left': '.5em solid #ff5655',
				'font-style': 'italic',
				'margin-left': '0',
				'padding-left': '1.5em',
				'padding-right': '1.5em'
			}
		} } );
	}

	/**
	 * @inheritDoc
	 */
	afterInit() {
		const editor = this.editor;
		const command = editor.commands.get( 'blockQuote' );

		// Overwrite default Enter key behavior.
		// If Enter key is pressed with selection collapsed in empty block inside a quote, break the quote.
		// This listener is added in afterInit in order to register it after list's feature listener.
		// We can't use a priority for this, because 'low' is already used by the enter feature, unless
		// we'd use numeric priority in this case.
		this.listenTo( this.editor.editing.view.document, 'enter', ( evt, data ) => {
			const doc = this.editor.model.document;
			const positionParent = doc.selection.getLastPosition().parent;

			if ( doc.selection.isCollapsed && positionParent.isEmpty && command.value ) {
				this.editor.execute( 'blockQuote' );
				this.editor.editing.view.scrollToTheSelection();

				data.preventDefault();
				evt.stop();
			}
		} );
	}
}
