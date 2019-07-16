import FlashRuntime from "./runtime";

export default FlashRuntime.register( 'Md5', {
    init: function() {
        // do nothing.
    },

    loadFromBlob: function( file ) {
        var owner = this.owner;
        var me = this;

        me.result = hashString(file.name + file.size + file.lastModifiedDate);
        owner.trigger('complete');
    },

    getResult: function() {
        return this.result;
    }
});

function hashString( str ) {
    var hash = 0,
        i = 0,
        len = str.length,
        _char;

    for ( ; i < len; i++ ) {
        _char = str.charCodeAt( i );
        hash = _char + (hash << 6) + (hash << 16) - hash;
    }

    return hash;
}
