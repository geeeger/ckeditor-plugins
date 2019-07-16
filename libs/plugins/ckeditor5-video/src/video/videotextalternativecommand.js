import Command from '@ckeditor/ckeditor5-core/src/command';
import { isVideo } from './utils';

export default class VideoTextAlternativeCommand extends Command {
    refresh() {
        const element = this.editor.model.document.selection.getSelectedElement();

        this.isEnabled = isVideo( element );

        if ( isVideo( element ) && element.hasAttribute( 'alt' ) ) {
            this.value = element.getAttribute( 'alt' );
        } else {
            this.value = false;
        }
    }

    execute( options ) {
        const model = this.editor.model;
        const videoElement = model.document.selection.getSelectedElement();

        model.change( writer => {
            writer.setAttribute( 'alt', options.newValue, videoElement );
        } );
    }
}
