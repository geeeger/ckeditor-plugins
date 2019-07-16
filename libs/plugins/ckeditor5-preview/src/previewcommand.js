import Command from '@ckeditor/ckeditor5-core/src/command';

export default class PreviewCommand extends Command {
    constructor( editor, attributeKey ) {
        super( editor, attributeKey );
        this.isEnabled = true;
    }

    refresh() {
        this.isEnabled = true;
    }

    execute() {
        const doc = document;
        const win = window;
        const data = this.editor.getData();
        var model = document.createElement('div');
        model.className = 'cke-preview-model';
        model.innerHTML = `<div class="cke-preview-close-btn">x</div><div class="cke-preview-content">${data}</div>`;
        model._closeListener = function (e) {
            const target = e.target;
            if (target.className === 'cke-preview-close-btn') {
                model.removeEventListener('click', model._closeListener);
                model._closeListener = null;
                model.parentNode.removeChild(model);
                model = null
            }
        }

        model.addEventListener('click', model._closeListener);
        doc.body.appendChild(model);
    }
}
