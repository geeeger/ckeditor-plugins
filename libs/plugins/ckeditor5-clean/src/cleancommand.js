import Command from '@ckeditor/ckeditor5-core/src/command';

export default class CleanCommand extends Command {
    constructor( editor ) {
        super( editor);
        this.writeList = {
            video: 'video',
            image: 'image',
            img: 'image',
            caption: 'caption',
            listItem: 'listItem'
        };
    }

    execute( options = {} ) {
        const model = this.editor.model;
        const document = model.document;
        const selection = document.selection;

        model.change( writer => {

            const blocks = Array.from(selection.getSelectedBlocks());
            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i];
                this.removeAttribute(writer, block);
                if (block._children.length) {
                    const children = Array.from(block.getChildren());
                    for (let j = 0; j < children.length; j++) {
                        const child = children[j];
                        this.removeAttribute(writer, child);
                    }
                }
            }
        } );
    }

    removeAttribute(writer, block) {
        const attributes = Array.from(block.getAttributeKeys());
        if (this.writeList[block.name]) {
            return;
        }
        for (let k = 0; k < attributes.length ; k++) {
            writer.removeAttribute( attributes[k] , block);
        }
    }
}
