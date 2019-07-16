import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from './filerepository';
import UIElement from '@ckeditor/ckeditor5-engine/src/view/uielement';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import ViewRange from '@ckeditor/ckeditor5-engine/src/view/range';
import env from '@ckeditor/ckeditor5-utils/src/env';

import '../theme/videouploadprogress.css';
import '../theme/videouploadicon.css';
import '../theme/videouploadloader.css';

export default class VideoUploadProgress extends Plugin {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// Upload status change - update video's view according to that status.
		editor.editing.downcastDispatcher.on( 'attribute:uploadStatus:video', ( ...args ) => this.uploadStatusChange( ...args ) );
	}

	/**
	 * This method is called each time the video `uploadStatus` attribute is changed.
	 *
	 * @param {module:utils/eventinfo~EventInfo} evt An object containing information about the fired event.
	 * @param {Object} data Additional information about the change.
	 * @param {module:engine/conversion/modelconsumable~ModelConsumable} consumable Values to consume.
	 * @param {Object} conversionApi
	 */
	uploadStatusChange( evt, data, conversionApi ) {
		const editor = this.editor;
		const modelVideo = data.item;
		const uploadId = modelVideo.getAttribute( 'uploadId' );

		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		const fileRepository = editor.plugins.get( FileRepository );
		const status = uploadId ? data.attributeNewValue : null;
		const viewFigure = editor.editing.mapper.toViewElement( modelVideo );
		const viewWriter = conversionApi.writer;

		if ( status == 'reading' ) {
			// Start "appearing" effect and show placeholder with infinite progress bar on the top
			// while video is read from disk.
			_startAppearEffect( viewFigure, viewWriter );
			_showPlaceholder( viewFigure, viewWriter );

			return;
		}

		// Show progress bar on the top of the video when video is uploading.
		if ( status == 'uploading' ) {
			const loader = fileRepository.loaders.get( uploadId );

			// Start appear effect if needed
			_startAppearEffect( viewFigure, viewWriter );

			if ( !loader ) {
				// There is no loader associated with uploadId - this means that video came from external changes.
				// In such cases we still want to show the placeholder until video is fully uploaded.
				_showPlaceholder( viewFigure, viewWriter );
			} else {
				// Hide placeholder and initialize progress bar showing upload progress.
				_hidePlaceholder( viewFigure, viewWriter );
				_showProgressBar( viewFigure, viewWriter, loader, editor.editing.view );
			}

			return;
		}

		// Because in Edge there is no way to show fancy animation of completeIcon we need to skip it.
		if ( status == 'complete' && fileRepository.loaders.get( uploadId ) && !env.isEdge ) {
			_showCompleteIcon( viewFigure, viewWriter, editor.editing.view );
		}

		// Clean up.
		_hideProgressBar( viewFigure, viewWriter );
		_hidePlaceholder( viewFigure, viewWriter );
		_stopAppearEffect( viewFigure, viewWriter );
	}
}

// Symbol added to progress bar UIElement to distinguish it from other elements.
const progressBarSymbol = Symbol( 'progress-bar' );

// Adds ck-video-appear class to the video figure if one is not already applied.
//
// @param {module:engine/view/containerelement~ContainerElement} viewFigure
// @param {module:engine/view/writer~Writer} writer
function _startAppearEffect( viewFigure, writer ) {
	if ( !viewFigure.hasClass( 'ck-appear' ) ) {
		writer.addClass( 'ck-appear', viewFigure );
	}
}

// Removes ck-video-appear class to the video figure if one is not already removed.
//
// @param {module:engine/view/containerelement~ContainerElement} viewFigure
// @param {module:engine/view/writer~Writer} writer
function _stopAppearEffect( viewFigure, writer ) {
	writer.removeClass( 'ck-appear', viewFigure );
}

// Shows placeholder together with infinite progress bar on given video figure.
//
// @param {String} Data-uri with a svg placeholder.
// @param {module:engine/view/containerelement~ContainerElement} viewFigure
// @param {module:engine/view/writer~Writer} writer
function _showPlaceholder( viewFigure, writer ) {
	if ( !viewFigure.hasClass( 'ck-video-upload-placeholder' ) ) {
		writer.addClass( 'ck-video-upload-placeholder', viewFigure );
	}
}

// Removes placeholder together with infinite progress bar on given video figure.
//
// @param {module:engine/view/containerelement~ContainerElement} viewFigure
// @param {module:engine/view/writer~Writer} writer
function _hidePlaceholder( viewFigure, writer ) {
	if ( viewFigure.hasClass( 'ck-video-upload-placeholder' ) ) {
		writer.removeClass( 'ck-video-upload-placeholder', viewFigure );
	}
}

// Shows progress bar displaying upload progress.
// Attaches it to the file loader to update when upload percentace is changed.
//
// @param {module:engine/view/containerelement~ContainerElement} viewFigure
// @param {module:engine/view/writer~Writer} writer
// @param {module:upload/filerepository~FileLoader} loader
// @param {module:engine/view/view~View} view
function _showProgressBar( viewFigure, writer, loader, view ) {
	const progressBar = _createProgressBar( writer );
	writer.insert( writer.createPositionAt( viewFigure, 'end' ), progressBar );

	// Update progress bar width when uploadedPercent is changed.
	loader.on( 'change:uploadedPercent', ( evt, name, value ) => {
		view.change( writer => {
			writer.setStyle( 'width', value + '%', progressBar );
		} );
	} );
}

// Hides upload progress bar.
//
// @param {module:engine/view/containerelement~ContainerElement} viewFigure
// @param {module:engine/view/writer~Writer} writer
function _hideProgressBar( viewFigure, writer ) {
	_removeUIElement( viewFigure, writer, progressBarSymbol );
}

// Shows complete icon and hides after a certain amount of time.
//
// @param {module:engine/view/containerelement~ContainerElement} viewFigure
// @param {module:engine/view/writer~Writer} writer
// @param {module:engine/view/view~View} view
function _showCompleteIcon( viewFigure, writer, view ) {
	const completeIcon = new UIElement( 'div', { class: 'ck-video-upload-complete-icon' } );

	writer.insert( writer.createPositionAt( viewFigure, 'end' ), completeIcon );

	setTimeout( () => {
		view.change( writer => writer.remove( writer.createRangeOn( completeIcon ) ) );
	}, 3000 );
}

// Create progress bar element using {@link module:engine/view/uielement~UIElement}.
//
// @private
// @param {module:engine/view/writer~Writer} writer
// @returns {module:engine/view/uielement~UIElement}
function _createProgressBar( writer ) {
	const progressBar = writer.createUIElement( 'div', { class: 'ck-video-progress-bar' } );

	writer.setCustomProperty( progressBarSymbol, true, progressBar );

	return progressBar;
}

// Returns {@link module:engine/view/uielement~UIElement} of given unique property from video figure element.
// Returns `undefined` if element is not found.
//
// @private
// @param {module:engine/view/element~Element} imageFigure
// @param {Symbol} uniqueProperty
// @returns {module:engine/view/uielement~UIElement|undefined}
function _getUIElement( videoFigure, uniqueProperty ) {
	for ( const child of videoFigure.getChildren() ) {
		if ( child.getCustomProperty( uniqueProperty ) ) {
			return child;
		}
	}
}

// Removes {@link module:engine/view/uielement~UIElement} of given unique property from video figure element.
//
// @private
// @param {module:engine/view/element~Element} videoFigure
// @param {module:engine/view/writer~Writer} writer
// @param {Symbol} uniqueProperty
function _removeUIElement( viewFigure, writer, uniqueProperty ) {
	const element = _getUIElement( viewFigure, uniqueProperty );

	if ( element ) {
		writer.remove( writer.createRangeOn( element ) );
	}
}
