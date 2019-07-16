/**
 * @fileOverview clean.js
 * @description 删除块上样式
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import CleanEditing from './cleanediting';
import CleanUI from './cleanui';

export default class Cleaan extends Plugin {
    static get requires() {
        return [ CleanEditing, CleanUI ];
    }
    static get pluginName() {
        return 'Clean';
    }
}
