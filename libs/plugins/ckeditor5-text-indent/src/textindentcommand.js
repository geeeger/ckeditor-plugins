import Command from '@ckeditor/ckeditor5-core/src/command';
import first from '@ckeditor/ckeditor5-utils/src/first';

const TEXT_INDENT = 'textIndent';

/**
 * The alignment command plugin.
 *
 * @extends module:core/command~Command
 */
export default class TextIndentCommand extends Command {

    constructor( editor ) {
        super( editor, TEXT_INDENT );
        this.attributeKey = TEXT_INDENT;
    }

    refresh() {
        const firstBlock = first( this.editor.model.document.selection.getSelectedBlocks() );
        this.isEnabled = !!firstBlock && this._canBeIndented( firstBlock );
        this.value = ( this.isEnabled && firstBlock.hasAttribute( this.attributeKey ) ) ? firstBlock.getAttribute( this.attributeKey ) : '';
    }

    execute( options = {} ) {
        const editor = this.editor;
        const model = editor.model;
        const doc = model.document;

        const value = options.value;

        model.change( writer => {
            const blocks = Array.from( doc.selection.getSelectedBlocks() ).filter( block => this._canBeIndented( block ) );
            const currentIndent = blocks[ 0 ].getAttribute( TEXT_INDENT );

            const removeIndent = value === 'default' || currentIndent === value || !value;

            if ( removeIndent ) {
                removeIndentFromSelection( blocks, writer );
            } else {
                setIndentOnSelection( blocks, writer, value );
            }
        } );
    }

    _canBeIndented( block ) {
        return this.editor.model.schema.checkAttribute( block, TEXT_INDENT );
    }
}

function removeIndentFromSelection( blocks, writer ) {
    for ( const block of blocks ) {
        writer.removeAttribute( TEXT_INDENT, block );
    }
}

function setIndentOnSelection( blocks, writer, indent ) {
    for ( const block of blocks ) {
        writer.setAttribute( TEXT_INDENT, indent, block );
    }
}
