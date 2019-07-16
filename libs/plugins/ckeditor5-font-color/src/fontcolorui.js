import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { normalizeOptions } from './utils';
import fontColorIcon from '../theme/icons/font-colors.svg';

export default class FontColorUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        const options = this._getLocalizedOptions();

        const command = editor.commands.get( 'fontColor' );

        // Register UI component.
        editor.ui.componentFactory.add( 'fontColor', locale => {
            const dropdownView = createDropdown( locale );
            addListToDropdown( dropdownView, _prepareListOptions( options, command ) );

            // Create dropdown model.
            dropdownView.buttonView.set( {
                label: t( 'Font Color' ),
                icon: fontColorIcon,
                tooltip: true
            } );

            dropdownView.extendTemplate( {
                attributes: {
                    class: 'ck-font-color-dropdown'
                }
            } );

            // dropdownView.bind( 'isEnabled' ).to( command );

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
            'Default color': t( 'Default color' ),
            Yellow: t( 'Yellow' ),
            Green: t( 'Green' ),
            Pink: t( 'Pink' ),
            Blue: t( 'Blue' ),
            Red: t( 'Red' ),
            Black: t( 'Black' ),
            Gray: t( 'Gray' )
        };

        const options = normalizeOptions( editor.config.get( 'fontColor.options' ) );

        return options.map( option => {
            const title = localizedTitles[ option.title ];
            if ( title && title != option.title ) {
                // Clone the option to avoid altering the original `namedPresets` from `./utils.js`.
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
                commandName: 'fontColor',
                commandParam: option.model,
                label: option.title,
                class: 'ck-fontcolor-option',
                withText: true
            } )
        };

        if ( option.view && option.view.styles ) {
            def.model.set( 'labelStyle', `color: ${ option.view.styles[ 'color' ] }` );
        }

        if ( option.view && option.view.classes ) {
            def.model.set( 'class', `${ def.model.class } ${ option.view.classes }` );
        }

        def.model.bind( 'isOn' ).to( command, 'value', value => value === option.model );

        itemDefinitions.add( def );
    }
    return itemDefinitions;
}