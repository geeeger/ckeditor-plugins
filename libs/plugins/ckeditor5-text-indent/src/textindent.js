import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import TextIndentEditing from './textindentediting';
import TextIndentUI from './textindentui';

export default class TextIndent extends Plugin {
    static get requires() {
        return [ TextIndentEditing, TextIndentUI ];
    }

    static get pluginName() {
        return 'TextIndent';
    }
}