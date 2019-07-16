import Html5Runtime from "./runtime";
import Blob from "../../lib/blob";

export default Html5Runtime.register( 'Blob', {
    slice: function( start, end ) {
        var blob = this.owner.source,
            slice = blob.slice || blob.webkitSlice || blob.mozSlice;

        blob = slice.call( blob, start, end );

        return new Blob( this.getRuid(), blob );
    }
});