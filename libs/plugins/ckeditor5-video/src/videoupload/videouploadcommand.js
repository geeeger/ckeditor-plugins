import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ModelSelection from '@ckeditor/ckeditor5-engine/src/model/selection';
import FileRepository from './filerepository';
import Command from '@ckeditor/ckeditor5-core/src/command';

import mix from '@ckeditor/ckeditor5-utils/src/mix';
import EmitterMixin from '@ckeditor/ckeditor5-utils/src/emittermixin';
import Token from '@ckeditor/ckeditor-cloud-services-core/src/token/token';
import Makefile from './mkfile';
import { buildParams, hashString } from '../../../utils';
import WebUploader from '../../../../webuploader/webuploader';

const DEFAULT_WEBUPLOADER_CONFIG = {
	chunked: true,
	chunkSize: 4 * 1024 * 1024,
	sendAsBinary: true
};

const UNDF = undefined;

function isUndefined(obj) {
	return obj === UNDF;
}

class UploaderAdapter {
	constructor( loader, config = {} ) {
		if (isUndefined(config.tokenUrl)) {
			console.warn('未设置uploadConfig.tokenUrl');
			config.tokenUrl = '';
		}

		if (isUndefined(config.uploadUrl)) {
			console.warn('未设置uploadConfig.uploadUrl');
			config.uploadUrl = '';
		}

		if (isUndefined(config.wcsUrl)) {
			console.warn('未设置uploadConfig.wcsUrl');
			config.wcsUrl = '';
		}
		this.loader = loader;
		this._config = config;
		this._webUploaderConfig = Object.assign({}, DEFAULT_WEBUPLOADER_CONFIG, this._config.webUploader);
		this.uploader = WebUploader.create(this._webUploaderConfig);
		this.ctxs = {};
	}

	upload() {
		return new Promise((resolve, reject) => {
			this.uploader.on('beforeSendFile', (block) => {
				let deferred = WebUploader.Deferred();
				let file = block.source;
				Makefile.create(buildParams(this._config.tokenUrl, {
					type: 'video',
					file_md5: hashString(file.name + file.size + file.lastModifiedDate),
					compress: 1
				}), { method: 'GET' })
				.then((t) => {
					try {
						let tokenVal = JSON.parse(t.value);
						this._token = tokenVal;
						deferred.resolve();
					} catch (e) {
						deferred.reject(new Error('登录失效，请复制编辑信息并重新登录登录'));
					}
				})
				.catch((e) => {
					deferred.reject(e);
				})
				return deferred.promise();
			});

			this.uploader.on('beforeSend', (block) => {
				let deferred = WebUploader.Deferred();
				block.options = {
					headers: {
						'Content-Type': 'application/octet-stream',
						'Authorization': this._token.token,
						'UploadBatch': this._token.UploadBatch
					},
					server: this._config.uploadUrl + '/mkblk/' + (block.end - block.start) + '/' + block.chunk 
				};
				deferred.resolve();
				return deferred.promise();
			});

			this.uploader.on('uploadAccept', (block, ret) => {
				// 保存每块返回的ctx
				this.ctxs[block.chunk] = ret.ctx;
				this.loader.uploadTotal = block.chunks;
                this.loader.uploaded = 1;

			});

			this.uploader.on('uploadSuccess', (file) => {
				this.ctxs.length = file.blocks.length;
				Makefile.create(this._config.uploadUrl + '/mkfile/' + file.size, {
					method: 'POST',
					headers: {
						'Content-Type': 'text/plain;charset=UTF-8',
						'Authorization': this._token.token,
						'UploadBatch': this._token.UploadBatch
					},
					data: Array.from(this.ctxs).join(',')
				})
					.then((t) => {
						let re = JSON.parse(t.value);
						if (re.code) {
							reject(new Error(re.message || '创建云文件失败'));
							return;
						}
						resolve({
							url: this._config.wcsUrl + '/' + re.key + '.mp4'
						});
					})
					.catch(reject)
			});

			this.uploader.on('uploadError', ( file, reason ) => {
				reject(reason || new Error('上传失败，请重试'));
			});

			this.uploader.on('error', reject);
			this.uploader.addFile(this.loader.file);
			this.uploader.upload();
		});
	}

	abort() {
		this.uploader.stop();
		this.uploader.destroy();
	}
}

export default class VideoUploadCommand extends Command {
	execute( options ) {
		const editor = this.editor;
		const doc = editor.model.document;
		const file = options.file;
		const fileRepository = editor.plugins.get( FileRepository );
		const config = this.editor.config.get( 'uploadConfig' );

		editor.model.change( writer => {
			/**
			 * [description]
			 * 每次重启
			 * @param  {[type]} loader [description]
			 * @return {[type]}        [description]
			 */
			fileRepository.createUploadAdapter = loader => {
				return new UploaderAdapter(loader, config);
			}

			const loader = fileRepository.createLoader( file );

			if ( !loader ) {
				return;
			}

			const videoElement = writer.createElement( 'video', {
				uploadId: loader.id
			} );

			let insertAtSelection;

			if ( options.insertAt ) {
				insertAtSelection = new ModelSelection( [ new ModelRange( options.insertAt ) ] );
			} else {
				insertAtSelection = doc.selection;
			}

			editor.model.insertContent( videoElement, insertAtSelection );

			// Inserting an image might've failed due to schema regulations.
			if ( videoElement.parent ) {
				writer.setSelection( videoElement, 'on' );
			}
		} );
	}
}
