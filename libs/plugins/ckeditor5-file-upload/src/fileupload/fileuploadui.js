import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import imageIcon from '../theme/icons/file.svg';

export default class FileUploadUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'fileUpload', locale => {
			const view = new FileDialogButtonView( locale );

			view.set( {
				acceptedType: '*',
				allowMultipleFiles: true
			} );

			view.buttonView.set( {
				label: t( 'Insert file' ),
				icon: imageIcon,
				tooltip: true
			} );

			view.on( 'done', ( evt, files ) => {
				const f = Array.from( files );

				if ( f.length ) {
					editor.execute( 'fileUpload', { file: f } );
				}
			} );

			return view;
		} );
	}
}
