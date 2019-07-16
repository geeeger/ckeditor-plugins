import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import VideoTextAlternativeEditing from './videotextalternativeediting';
import VideoTextAlternativeUI from './videotextalternativeui';

/**
 * The video text alternative plugin.
 */
export default class VideoTextAlternative extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ VideoTextAlternativeEditing, VideoTextAlternativeUI ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'VideoTextAlternative';
    }
}
