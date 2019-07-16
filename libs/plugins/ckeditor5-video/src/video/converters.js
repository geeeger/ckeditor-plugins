import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import first from '@ckeditor/ckeditor5-utils/src/first';

export function viewFigureToModel() {
    return dispatcher => {
        dispatcher.on( 'element:figure', converter );
    };

    function converter( evt, data, conversionApi ) {
        // Do not convert if this is not an "video figure".
        if ( !conversionApi.consumable.test( data.viewItem, { name: true, classes: 'video' } ) ) {
            return;
        }

        // Find an video element inside the figure element.
        const viewVideo = Array.from( data.viewItem.getChildren() ).find( viewChild => viewChild.is( 'video' ) );

        // Do not convert if video element is absent, is missing src attribute or was already converted.
        if ( !viewVideo || !viewVideo.hasAttribute( 'src' ) || !conversionApi.consumable.test( viewVideo, { name: true } ) ) {
            return;
        }

        // Convert view video to model video.
        const conversionResult = conversionApi.convertItem( viewVideo, data.modelCursor );

        // Get video element from conversion result.
        const modelVideo = first( conversionResult.modelRange.getItems() );

        // When video wasn't successfully converted then finish conversion.
        if ( !modelVideo ) {
            return;
        }

        // const viewWriter = conversionApi.writer;

        // Convert rest of the figure element's children as an video children.
        conversionApi.convertChildren( data.viewItem, conversionApi.writer.createPositionAt( modelVideo, 0 ) );

        // Set video range as conversion result.
        data.modelRange = conversionResult.modelRange;

        // Continue conversion where video conversion ends.
        data.modelCursor = conversionResult.modelCursor;
    }
}

export function modelToViewAttributeConverter( attributeKey ) {
    return dispatcher => {
        dispatcher.on( `attribute:${ attributeKey }:video`, converter );
    };

    function converter( evt, data, conversionApi ) {
        if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
            return;
        }

        const viewWriter = conversionApi.writer;
        const figure = conversionApi.mapper.toViewElement( data.item );
        const video = figure.getChild( 0 );

        if ( data.attributeNewValue !== null ) {
            viewWriter.setAttribute( data.attributeKey, data.attributeNewValue, video );
        } else {
            viewWriter.removeAttribute( data.attributeKey, video );
        }
    }
}
