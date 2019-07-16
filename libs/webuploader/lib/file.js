import Base from "../base";
import Blob from "./blob";
var uid = 1,
    rExt = /\.([^.]+)$/;
function File( ruid, file ) {
    var ext;

    this.name = file.name || ('untitled' + uid++);
    ext = rExt.exec( file.name ) ? RegExp.$1.toLowerCase() : '';

    // todo 支持其他类型文件的转换。
    // 如果有 mimetype, 但是文件名里面没有找出后缀规律
    if ( !ext && file.type ) {
        ext = /\/(jpg|jpeg|png|gif|bmp)$/i.exec( file.type ) ?
                RegExp.$1.toLowerCase() : '';
        this.name += '.' + ext;
    }

    this.ext = ext;
    this.lastModifiedDate = file.lastModifiedDate ||
            (new Date()).toLocaleString();

    Blob.apply( this, arguments );
}

export default Base.inherits( Blob, File );
