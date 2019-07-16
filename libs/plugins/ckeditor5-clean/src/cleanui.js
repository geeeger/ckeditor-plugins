import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import cleanIcon from '../theme/icons/clean.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class CleanUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        // Configure the button
        editor.ui.componentFactory.add( 'clean', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: t('Clean style'),
                icon: cleanIcon,
                tooltip: true
            } );

            // Callback executed once the button is clicked.
            view.on( 'execute', (evt) => {
                editor.execute( 'clean' );
                // editor.editing.view.focus();
            } );

            // this.listenTo( view, 'execute', () => editor.execute( 'clean' ) );

            return view;
        } );
    }
}
