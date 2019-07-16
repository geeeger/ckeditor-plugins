import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import previewIcon from '../theme/icons/preview.svg';

const PREVIEW = 'preview';

export default class PreviewUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        // Add bold button to feature components.
        editor.ui.componentFactory.add( PREVIEW, locale => {
            const command = editor.commands.get( PREVIEW );
            const view = new ButtonView( locale );

            view.set( {
                label: t( 'Preview' ),
                icon: previewIcon,
                keystroke: 'CTRL+P',
                tooltip: true
            } );

            // Execute command.
            view.on( 'execute', () => {
                editor.execute( PREVIEW )
            } );

            return view;
        } );
    }
}
