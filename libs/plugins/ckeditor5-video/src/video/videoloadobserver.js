import Observer from '@ckeditor/ckeditor5-engine/src/view/observer/observer';

export default class VideoLoadObserver extends Observer {
    constructor( view ) {
        super( view );

        this._observedElements = new Set();
    }

    observe( domRoot, name ) {
        const viewRoot = this.document.getRoot( name );

        // When there is a change in one of the view element
        // we need to check if there are any new `<video>` elements to observe.
        viewRoot.on( 'change:children', ( evt, node ) => {
            // Wait for the render to be sure that `<video>` elements are rendered in the DOM root.
            this.view.once( 'render', () => this._updateObservedElements( domRoot, node ) );
        } );
    }

    /**
     * Updates the list of observed `<video/>` elements.
     *
     * @private
     * @param {HTMLElement} domRoot DOM root element.
     * @param {module:engine/view/element~Element} viewNode View element where children have changed.
     */
    _updateObservedElements( domRoot, viewNode ) {
        if ( !viewNode.is( 'element' ) || viewNode.is( 'attributeElement' ) ) {
            return;
        }

        const domNode = this.view.domConverter.mapViewToDom( viewNode );

        // If there is no `domNode` it means that it was removed from the DOM in the meanwhile.
        if ( !domNode ) {
            return;
        }

        for ( const domElement of domNode.querySelectorAll( 'video' ) ) {
            if ( !this._observedElements.has( domElement ) ) {
                this.listenTo( domElement, 'load', ( evt, domEvt ) => this._fireEvents( domEvt ) );
                this._observedElements.add( domElement );
            }
        }

        // Clean up the list of observed elements from elements that has been removed from the root.
        for ( const domElement of this._observedElements ) {
            if ( !domRoot.contains( domElement ) ) {
                this.stopListening( domElement );
                this._observedElements.delete( domElement );
            }
        }
    }

    /**
     * Fires {@link module:engine/view/document~Document#event:layoutChanged} and
     * {@link module:engine/view/document~Document#event:videoLoaded}
     * if observer {@link #isEnabled is enabled}.
     *
     * @protected
     * @param {Event} domEvent The DOM event.
     */
    _fireEvents( domEvent ) {
        if ( this.isEnabled ) {
            this.document.fire( 'layoutChanged' );
            this.document.fire( 'videoLoaded', domEvent );
        }
    }

    /**
     * @inheritDoc
     */
    destroy() {
        this._observedElements.clear();
        super.destroy();
    }
}
