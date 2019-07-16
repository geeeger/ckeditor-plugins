import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import videoIcon from '../theme/icons/video.svg';
import { findOptimalInsertionPosition } from './utils';

export default class VideoUploadUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Setup `videoUpload` button.
		editor.ui.componentFactory.add( 'videoUpload', locale => {
			const view = new FileDialogButtonView( locale );
			const command = editor.commands.get( 'videoUpload' );

			view.set( {
				acceptedType: 'video/*',
				allowMultipleFiles: false
			} );

			view.buttonView.set( {
				label: t( 'Insert video' ),
				icon: videoIcon,
				tooltip: true
			} );

			view.buttonView.bind( 'isEnabled' ).to( command );

			view.on( 'done', ( evt, files ) => {
				for ( const file of Array.from( files ) ) {
					const insertAt = findOptimalInsertionPosition( editor.model.document.selection );
					editor.execute( 'videoUpload', { file, insertAt } );
				}
			} );

			return view;
		} );
	}
}
