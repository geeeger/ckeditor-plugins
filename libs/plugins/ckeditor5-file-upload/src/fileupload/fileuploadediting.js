import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification';
import FileUploadCommand from './fileuploadcommand';

export default class FileUploadEditing extends Plugin {
	static get requires() {
		return [ FileRepository, Notification ];
	}

	init() {
		const editor = this.editor;
		const doc = editor.model.document;
		const schema = editor.model.schema;
		const fileRepository = editor.plugins.get( FileRepository );

		schema.register( 'fileUploaderPlaceHolder', {
			inheritAllFrom: '$text',
			isInline: true,
            allowAttributes: [ 'uploadId', 'uploadStatus', 'linkHref' ]
		} );

		editor.conversion.for('downcast').elementToElement( {
			model: 'fileUploaderPlaceHolder',
			view: ( modelElement, viewWriter ) => createFileUploaderPlaceHolderViewElement(modelElement, viewWriter )
		} );

		editor.commands.add( 'fileUpload', new FileUploadCommand( editor ) );

		doc.on( 'change', () => {
			const changes = doc.differ.getChanges( { includeChangesInGraveyard: true } );

			for ( const entry of changes ) {
				if ( entry.type == 'insert' && entry.name == 'fileUploaderPlaceHolder' ) {
					const item = entry.position.nodeAfter;
					const isInGraveyard = entry.position.root.rootName == '$graveyard';

					const uploadId = item.getAttribute( 'uploadId' );
					if ( !uploadId ) {
						continue;
					}

					const loader = fileRepository.loaders.get( uploadId );

					if ( !loader ) {
						continue;
					}

					if ( isInGraveyard ) {
						loader.abort();
					} else if ( loader.status == 'idle' ) {
						this._readAndUpload( loader, item );
					}
				}
			}
		} );
	}

	_readAndUpload( loader, imageElement ) {
		const editor = this.editor;
		const model = editor.model;
		const t = editor.locale.t;
		const fileRepository = editor.plugins.get( FileRepository );
		const notification = editor.plugins.get( Notification );

		model.enqueueChange( 'transparent', writer => {
			writer.setAttribute( 'uploadStatus', 'reading', imageElement );
		} );

		return loader.read()
			.then( data => {
				const promise = loader.upload();

				model.enqueueChange( 'transparent', writer => {
					writer.setAttribute( 'uploadStatus', 'uploading', imageElement );
				} );

				return promise;
			} )
			.then( data => {
				model.enqueueChange( 'transparent', writer => {
					writer.remove(imageElement);
					editor.execute( 'link', data.default );
				} );

				clean();
			} )
			.catch( error => {
				// If status is not 'error' nor 'aborted' - throw error because it means that something else went wrong,
				// it might be generic error and it would be real pain to find what is going on.
				if ( loader.status !== 'error' && loader.status !== 'aborted' ) {
					throw error;
				}

				// Might be 'aborted'.
				if ( loader.status == 'error' && error ) {
					notification.showWarning( error, {
						title: t( 'Upload failed' ),
						namespace: 'upload'
					} );
				}

				clean();

				// Permanently remove image from insertion batch.
				model.enqueueChange( 'transparent', writer => {
					writer.remove( imageElement );
				} );
			} );

		function clean() {
			model.enqueueChange( 'transparent', writer => {
				writer.removeAttribute( 'uploadId', imageElement );
				writer.removeAttribute( 'uploadStatus', imageElement );
			} );

			fileRepository.destroyLoader( loader );
		}
	}
}

function createFileUploaderPlaceHolderViewElement(model, viewWriter) {
	var text;
	var wraper;
	text = viewWriter.createText( '正在上传中,请勿同时上传两个文件' );
	wraper = viewWriter.createContainerElement( 'span', { class: 'qie-ckeditor-file-upload' } );
    viewWriter.insert( viewWriter.createPositionAt( wraper, 0 ), text );
    return wraper;
}

