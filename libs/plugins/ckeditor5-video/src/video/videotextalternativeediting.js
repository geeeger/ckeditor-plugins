import VideoTextAlternativeCommand from './videotextalternativecommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class VideoTextAlternativeEditing extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        this.editor.commands.add( 'videoTextAlternative', new VideoTextAlternativeCommand( this.editor ) );
    }
}
