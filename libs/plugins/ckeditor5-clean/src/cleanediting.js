import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import CleanCommand from './cleancommand';

export default class CleanEditing extends Plugin {
    /**
     * @inheritDoc
     */
    constructor( editor ) {
        super( editor );

        editor.commands.add( 'clean', new CleanCommand( editor ) );
    }

    // /**
    //  * @inheritDoc
    //  */
    // init() {
    //     const editor = this.editor;

    //     editor.model.schema.extend( '$text', { allowAttributes: 'clean' } );
    // }
}
