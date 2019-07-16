import Base from "../base";
import Uploader from "../uploader";
import Md5 from "../lib/md5";
import Blob from "../lib/blob";
import Widget from "./widget";

export default Uploader.register({
    name: 'md5',


    /**
     * 计算文件 md5 值，返回一个 promise 对象，可以监听 progress 进度。
     *
     *
     * @method md5File
     * @grammar md5File( file[, start[, end]] ) => promise
     * @for Uploader
     * @example
     *
     * uploader.on( 'fileQueued', function( file ) {
     *     var $li = ...;
     *
     *     uploader.md5File( file )
     *
     *         // 及时显示进度
     *         .progress(function(percentage) {
     *             console.log('Percentage:', percentage);
     *         })
     *
     *         // 完成
     *         .then(function(val) {
     *             console.log('md5 result:', val);
     *         });
     *
     * });
     */
    md5File: function( file, start, end ) {
        var md5 = new Md5(),
            deferred = Base.Deferred(),
            blob = (file instanceof Blob) ? file :
                this.request( 'get-file', file ).source;

        md5.on( 'complete', function() {
            deferred.resolve( md5.getResult() );
        });

        if ( arguments.length > 1 ) {
            start = start || 0;
            end = end || 0;
            start < 0 && (start = blob.size + start);
            end < 0 && (end = blob.size + end);
            end = Math.min( end, blob.size );
            blob = blob.slice( start, end );
        }

        md5.loadFromBlob( blob );

        return deferred.promise();
    }
});