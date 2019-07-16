import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileUploadUI from './fileuploadui';
import FileUploadEditing from './fileuploadediting';
export default class FileUpload extends Plugin {
	static get pluginName() {
		return 'FileUpload';
	}

	static get requires() {
		return [ FileUploadEditing, FileUploadUI ];
	}
}
