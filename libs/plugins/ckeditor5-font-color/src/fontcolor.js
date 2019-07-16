/**
 * @fileOverview fontcolor.js
 * @description 设置字体颜色
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FontColorEditing from './fontcolorediting';
import FontColorUI from './fontcolorui';

export default class FontColor extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ FontColorEditing, FontColorUI ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'FontColor';
    }
}
