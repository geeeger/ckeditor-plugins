import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import textIndentIcon from '../theme/icons/text-indent.svg';
import { normalizeOptions } from './utils';

export default class TextIndentUI extends Plugin {
    init() {
        const editor = this.editor;
        const componentFactory = editor.ui.componentFactory;
        const t = editor.t;
        const options = this._getLocalizedOptions();

        const command = editor.commands.get( 'fontSize' );

        componentFactory.add( 'textIndent', locale => {
            const dropdownView = createDropdown( locale );
            addListToDropdown( dropdownView, _prepareListOptions( options, command ) );

            // Configure dropdown properties an behavior.
            dropdownView.buttonView.set( {
                label: t( 'Text Indent' ),
                icon: textIndentIcon,
                tooltip: true
            } );

            dropdownView.extendTemplate( {
                attributes: {
                    class: [
                        'ck-text-indent-dropdown'
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

        const options = normalizeOptions( editor.config.get( 'textIndent.options' ) );

        return options.map( option => {
            if ( option.title === 'Default text indent' ) {
                option.title = t( 'Default text indent' );
            }

            return option;
        } );
    }
}

function _prepareListOptions( options, command ) {
    const itemDefinitions = new Collection();

    // Create dropdown items.
    for ( const option of options ) {
        const def = {
            type: 'button',
            model: new Model( {
                commandName: 'textIndent',
                commandParam: option.model,
                label: option.title,
                withText: true
            } )
        };

        if ( option.view && option.view.classes ) {
            def.model.set( 'class', `${ def.model.class } ${ option.view.classes }` );
        }

        def.model.bind( 'isOn' ).to( command, 'value', value => value === option.model );

        itemDefinitions.add( def );
    }

    return itemDefinitions;
}
