import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import PreviewEditing from './previewediting';
import PreviewUI from './previewui';
import '../theme/preview.css';

export default class Preview extends Plugin {
    static get requires() {
        return [ PreviewEditing, PreviewUI ];
    }

    static get pluginName() {
        return 'Preview';
    }
}
