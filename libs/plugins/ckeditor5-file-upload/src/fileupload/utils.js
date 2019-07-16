export function insertFile( writer, model, attributes = {} ) {
	const position = model.document.selection.getFirstPosition();
	const fileElement = writer.createElement( 'fileUploaderPlaceHolder', attributes );
	writer.insert(fileElement, position);
	writer.setSelection( writer.createRangeOn( fileElement ) );
}
