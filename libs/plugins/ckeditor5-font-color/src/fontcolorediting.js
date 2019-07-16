import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import FontColorCommand from './fontcolorcommand';
import { normalizeOptions } from './utils';
import { buildDefinition } from '../../utils';

const FONT_COLOR = 'fontColor';

export default class FontColorEditing extends Plugin {
    /**
     * @inheritDoc
     */
    constructor( editor ) {
        super( editor );

        editor.config.define( FONT_COLOR, {
            options: [
                'Yellow',
                'Green',
                'Pink',
                'default',
                'Blue',
                'Red',
                'Black',
                'Gray'
            ]
        } );

        // Get configured font family options without "default" option.
        const options = normalizeOptions( editor.config.get( 'fontColor.options' ) ).filter( item => item.model );
        const definition = buildDefinition( FONT_COLOR, options );

        // Set-up the two-way conversion.
        editor.conversion.attributeToElement( definition );

        editor.commands.add( FONT_COLOR, new FontColorCommand( editor ) );
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;

        // Allow fontFamily attribute on text nodes.
        editor.model.schema.extend( '$text', { allowAttributes: FONT_COLOR } );
    }
}
