import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import TextIndentCommand from './textindentcommand';

import { normalizeOptions, buildDefinition } from './utils';

export default class TextIndetEditing extends Plugin {
    constructor( editor ) {
        super( editor );

        editor.config.define( 'textIndent', {
            options: [
                2,
                4,
                6,
                8,
                'default'
            ]
        } );

        const options = normalizeOptions( this.editor.config.get( 'textIndent.options' ) ).filter( item => item.model );
        const definition = buildDefinition( 'textIndent', options );

        editor.conversion.attributeToAttribute( definition );

        editor.commands.add( 'textIndent', new TextIndentCommand( editor ) );
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;

        schema.extend( '$block', { allowAttributes: 'textIndent' } );
    }

    /**
     * @inheritDoc
     */
    afterInit() {
        const editor = this.editor;
        const command = editor.commands.get( 'textIndent' );

        // Overwrite default Enter key behavior.
        // If Enter key is pressed with selection collapsed in empty block inside a quote, break the quote.
        // This listener is added in afterInit in order to register it after list's feature listener.
        // We can't use a priority for this, because 'low' is already used by the enter feature, unless
        // we'd use numeric priority in this case.
        this.listenTo( this.editor.editing.view.document, 'enter', ( evt, data ) => {
            const doc = this.editor.model.document;
            const positionParent = doc.selection.getLastPosition().parent;

            if ( doc.selection.isCollapsed && positionParent.isEmpty && command.value ) {
                this.editor.execute( 'textIndent' );
                this.editor.editing.view.scrollToTheSelection();

                data.preventDefault();
                evt.stop();
            }
        } );
    }
}
