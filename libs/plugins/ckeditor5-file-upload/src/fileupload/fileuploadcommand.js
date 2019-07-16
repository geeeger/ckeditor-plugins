import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import Command from '@ckeditor/ckeditor5-core/src/command';
import { insertFile } from './utils';

export default class FileUploadCommand extends Command {
	execute( options ) {
		const editor = this.editor;
		const model = editor.model;

		const fileRepository = editor.plugins.get( FileRepository );

		model.change( writer => {
			const filesToUpload = Array.isArray( options.file ) ? options.file : [ options.file ];
			for ( const file of filesToUpload ) {
				uploadFile( writer, model, fileRepository, file );
			}
		} );
	}
}

function uploadFile( writer, model, fileRepository, file ) {
	const loader = fileRepository.createLoader( file );
	if ( !loader ) {
		return;
	}
	insertFile( writer, model, {
		uploadId: loader.id,
		uploadStatus: 'uploading'
	} );
}
