import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import FontSizeCommand from './fontsizecommand';
import { normalizeOptions } from './utils';
import { buildDefinition } from '../../utils';

const FONT_SIZE = 'fontSize';

export default class FontSizeEditing extends Plugin {
    /**
     * @inheritDoc
     */
    constructor( editor ) {
        super( editor );

        // Define default configuration using named presets.
        editor.config.define( FONT_SIZE, {
            options: [
                'tiny',
                'small',
                'default',
                'big',
                'huge'
            ]
        } );

        // Define view to model conversion.
        const options = normalizeOptions( this.editor.config.get( 'fontSize.options' ) ).filter( item => item.model );

        const definition = buildDefinition( FONT_SIZE, options );

        // Set-up the two-way conversion.
        editor.conversion.attributeToElement( definition );

        // Add FontSize command.
        editor.commands.add( FONT_SIZE, new FontSizeCommand( editor ) );
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;

        // Allow fontSize attribute on text nodes.
        editor.model.schema.extend( '$text', { allowAttributes: FONT_SIZE } );
    }
}