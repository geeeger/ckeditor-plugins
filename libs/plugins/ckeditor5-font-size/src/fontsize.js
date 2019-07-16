import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FontSizeEditing from './fontsizeediting';
import FontSizeUI from './fontsizeui';

export default class FontSize extends Plugin {
    static get requires() {
        return [ FontSizeEditing, FontSizeUI ];
    }

    static get pluginName() {
        return 'FontSize';
    }
}
