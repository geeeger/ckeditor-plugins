import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from './filerepository';
import VideoUploadCommand from './videouploadcommand';
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification';
import ModelSelection from '@ckeditor/ckeditor5-engine/src/model/selection';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';

export default class VideoUploadEditing extends Plugin {
	static get requires() {
		return [ FileRepository, Notification ];
	}

	init() {
		const editor = this.editor;
		const doc = editor.model.document;
		const schema = editor.model.schema;
		const fileRepository = editor.plugins.get( FileRepository );

		// Setup schema to allow uploadId and uploadStatus for video.
		schema.extend( 'video', {
			allowAttributes: [ 'uploadId', 'uploadStatus' ]
		} );

		// Register videoUpload command.
		editor.commands.add( 'videoUpload', new VideoUploadCommand( editor ) );


		doc.on( 'change', () => {
			const changes = doc.differ.getChanges( { includeChangesInGraveyard: true } );

			for ( const entry of changes ) {
				if ( entry.type == 'insert' && entry.name == 'video' ) {
					const item = entry.position.nodeAfter;
					const isInGraveyard = entry.position.root.rootName == '$graveyard';

					// Check if the video element still has upload id.
					const uploadId = item.getAttribute( 'uploadId' );

					if ( !uploadId ) {
						continue;
					}

					// Check if the video is loaded on this client.
					const loader = fileRepository.loaders.get( uploadId );

					if ( !loader ) {
						continue;
					}

					if ( isInGraveyard ) {
						// If the video was inserted to the graveyard - abort the loading process.
						loader.abort();
					} else if ( loader.status == 'idle' ) {
						// If the video was inserted into content and has not been loaded, start loading it.
						setTimeout(() => {
							this._load( loader, item );
						}, 100);
					}
				}
			}
		} );
	}

	_load( loader, videoElement ) {
		const editor = this.editor;
		const model = editor.model;
		const t = editor.locale.t;
		const fileRepository = editor.plugins.get( FileRepository );
		const notification = editor.plugins.get( Notification );

		model.enqueueChange( 'transparent', writer => {
			writer.setAttribute( 'uploadStatus', 'uploading', videoElement );
		} );

		return loader.upload()
			.then( data => {
				model.enqueueChange( 'transparent', writer => {
					writer.setAttributes( {
						uploadStatus: 'complete',
						src: data.url,
						type: 'video/mp4',
						controls: 'controls',
						width: '100%',
						preload: 'metadata'
					}, videoElement );
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
				if ( loader.status == 'error' ) {
					notification.showWarning( error, {
						title: t( 'Upload failed' ),
						namespace: 'upload'
					} );
				}

				clean();

				// Permanently remove video from insertion batch.
				model.enqueueChange( 'transparent', writer => {
					writer.remove( videoElement );
				} );
			} );

		function clean() {
			model.enqueueChange( 'transparent', writer => {
				writer.removeAttribute( 'uploadId', videoElement );
				writer.removeAttribute( 'uploadStatus', videoElement );
			} );

			fileRepository.destroyLoader( loader );
		}
	}
}
