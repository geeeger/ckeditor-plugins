import Uploader from "../uploader";
import Runtime from "../runtime/runtime";
import Widget from "./widget";

Uploader.support = function() {
    return Runtime.hasRuntime.apply( Runtime, arguments );
};

export default Uploader.register({
    name: 'runtime',

    init: function() {
        if ( !this.predictRuntimeType() ) {
            throw Error('Runtime Error');
        }
    },

    /**
     * 预测Uploader将采用哪个`Runtime`
     * @grammar predictRuntimeType() => String
     * @method predictRuntimeType
     * @for  Uploader
     */
    predictRuntimeType: function() {
        var orders = this.options.runtimeOrder || Runtime.orders,
            type = this.type,
            i, len;

        if ( !type ) {
            orders = orders.split( /\s*,\s*/g );

            for ( i = 0, len = orders.length; i < len; i++ ) {
                if ( Runtime.hasRuntime( orders[ i ] ) ) {
                    this.type = type = orders[ i ];
                    break;
                }
            }
        }

        return type;
    }
});
