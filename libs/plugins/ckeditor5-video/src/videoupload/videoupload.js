import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import VideoUploadUI from './videouploadui';
import VideoUploadProgress from './videouploadprogress';
import VideoUploadEditing from './videouploadediting';

export default class VideoUpload extends Plugin {
    static get pluginName() {
        return 'VideoUpload';
    }

    static get requires() {
        return [ VideoUploadEditing, VideoUploadUI, VideoUploadProgress ];
    }
}
