import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import VideoEditing from './videoediting';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import VideoTextAlternative from './videotextalternative';

import '../theme/video.css';

export default class Video extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ VideoEditing, Widget, VideoTextAlternative ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'Video';
    }
}
