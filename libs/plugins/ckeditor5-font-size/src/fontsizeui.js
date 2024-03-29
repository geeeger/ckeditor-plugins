import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { normalizeOptions } from './utils';

import fontSizeIcon from '../theme/icons/font-size.svg';

export default class FontSizeUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        const options = this._getLocalizedOptions();

        const command = editor.commands.get( 'fontSize' );

        // Register UI component.
        editor.ui.componentFactory.add( 'fontSize', locale => {
            const dropdownView = createDropdown( locale );
            addListToDropdown( dropdownView, _prepareListOptions( options, command ) );

            // Create dropdown model.
            dropdownView.buttonView.set( {
                label: t( 'Font Size' ),
                icon: fontSizeIcon,
                tooltip: true
            } );

            dropdownView.extendTemplate( {
                attributes: {
                    class: [
                        'ck-font-size-dropdown'
                    ]
                }
            } );

            dropdownView.bind( 'isEnabled' ).to( command );

            // Execute command when an item from the dropdown is selected.
            this.listenTo( dropdownView, 'execute', evt => {
                editor.execute( evt.source.commandName, { value: evt.source.commandParam } );
                editor.editing.view.focus();
            } );

            return dropdownView;
        } );
    }

    _getLocalizedOptions() {
        const editor = this.editor;
        const t = editor.t;

        const localizedTitles = {
            'Default font size': t( 'Default font size' ),
            Tiny: t( 'Tiny' ),
            Small: t( 'Small' ),
            Big: t( 'Big' ),
            Huge: t( 'Huge' )
        };

        const options = normalizeOptions( editor.config.get( 'fontSize.options' ) );

        return options.map( option => {
            const title = localizedTitles[ option.title ];

            if ( title && title != option.title ) {
                option = Object.assign( {}, option, { title } );
            }

            return option;
        } );
    }
}

function _prepareListOptions( options, command ) {
    const itemDefinitions = new Collection();

    for ( const option of options ) {
        const def = {
            type: 'button',
            model: new Model( {
                commandName: 'fontSize',
                commandParam: option.model,
                label: option.title,
                class: 'ck-fontsize-option',
                withText: true
            } )
        };

        if ( option.view && option.view.styles ) {
            def.model.set( 'labelStyle', `font-size:${ option.view.styles[ 'font-size' ] }` );
        }

        if ( option.view && option.view.classes ) {
            def.model.set( 'class', `${ def.model.class } ${ option.view.classes }` );
        }

        def.model.bind( 'isOn' ).to( command, 'value', value => value === option.model );

        // Add the option to the collection.
        itemDefinitions.add( def );
    }

    return itemDefinitions;
}