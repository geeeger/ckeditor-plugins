import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import PreviewCommand from './previewcommand';

const PREVIEW = 'preview';

export default class PreviewEditing extends Plugin {
    init() {
        const editor = this.editor;

        // Create italic command.
        editor.commands.add( PREVIEW, new PreviewCommand( editor, PREVIEW ) );

        // Set the Ctrl+I keystroke.
        editor.keystrokes.set( 'CTRL+P', PREVIEW );
    }
}
