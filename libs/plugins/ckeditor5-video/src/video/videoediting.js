import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import VideoLoadObserver from './videoloadobserver';

import {
    viewFigureToModel,
    modelToViewAttributeConverter
} from './converters';

import { toVideoWidget } from './utils';

// import { downcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
// import { upcastElementToElement, upcastAttributeToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

// import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';

export default class VideoEditing extends Plugin {
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const t = editor.t;
        const conversion = editor.conversion;

        // const upcastElementToElement = conversion.for( 'upcast' ).elementToElement;
        // const downcastElementToElement = conversion.for( 'downcast' ).elementToElement;
        // const upcastAttributeToAttribute = conversion.for( 'upcast' ).attributeToAttribute;

        editor.editing.view.addObserver( VideoLoadObserver );

        schema.register( 'video', {
            isObject: true,
            isBlock: true,
            allowWhere: '$block',
            allowAttributes: [ 'alt', 'src', 'controls', 'type', 'width', 'height', 'preload' ]
        } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'video',
            view: ( modelElement, viewWriter ) => createVideoViewElement( viewWriter )
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'video',
            view: ( modelElement, viewWriter ) => toVideoWidget( createVideoViewElement( viewWriter ), viewWriter, t( 'video widget' ) )
        } );

        conversion.for( 'downcast' )
            .add( modelToViewAttributeConverter( 'src' ) )
            .add( modelToViewAttributeConverter( 'controls' ) )
            .add( modelToViewAttributeConverter( 'type' ) )
            .add( modelToViewAttributeConverter( 'width' ) )
            .add( modelToViewAttributeConverter( 'height' ) )
            .add( modelToViewAttributeConverter( 'preload' ) )
            .add( modelToViewAttributeConverter( 'alt' ) );

        conversion.for( 'upcast' )
            .elementToElement( {
                view: {
                    name: 'video',
                    attributes: {
                        src: true
                    }
                },
                model: ( viewVideo, modelWriter ) => modelWriter.createElement( 'video', {
                    src: viewVideo.getAttribute( 'src' ),
                    controls: 'controls',
                    type: viewVideo.getAttribute( 'type' ),
                    width: '100%',
                    height: 'auto',
                    preload: 'metadata'
                } )
            } )
            .attributeToAttribute( {
                view: {
                    name: 'video',
                    key: 'alt'
                },
                model: 'alt'
            } )
            .add( viewFigureToModel() );
    }
}

export function createVideoViewElement( writer ) {
    const emptyElement = writer.createEmptyElement( 'video' );
    const figure = writer.createContainerElement( 'figure', { class: 'video' } );

    writer.insert( writer.createPositionAt( figure, 0 ), emptyElement );

    return figure;
}
