import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';

export function findOptimalInsertionPosition( selection ) {
	const selectedElement = selection.getSelectedElement();

	if ( selectedElement ) {
		return ModelPosition._createAfter( selectedElement );
	}

	const firstBlock = selection.getSelectedBlocks().next().value;

	if ( firstBlock ) {
		// If inserting into an empty block – return position in that block. It will get
		// replaced with the video by insertContent(). #42.
		if ( firstBlock.isEmpty ) {
			return ModelPosition._createAt( firstBlock, 0 );
		}

		const positionAfter = ModelPosition._createAfter( firstBlock );

		// If selection is at the end of the block - return position after the block.
		if ( selection.focus.isTouching( positionAfter ) ) {
			return positionAfter;
		}

		// Otherwise return position before the block.
		return ModelPosition._createBefore( firstBlock );
	}

	return selection.focus;
}
