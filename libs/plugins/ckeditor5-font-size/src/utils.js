export function normalizeOptions( configuredOptions ) {
    // Convert options to objects.
    return configuredOptions
        .map( getOptionDefinition )
        // Filter out undefined values that `getOptionDefinition` might return.
        .filter( option => !!option );
}

// Default named presets map.
const namedPresets = {
    tiny: {
        title: 'Tiny',
        model: 'tiny',
        view: {
            name: 'span',
            styles: {
                'font-size': '.7em'
            },
            priority: 5
        }
    },
    small: {
        title: 'Small',
        model: 'small',
        view: {
            name: 'span',
            styles: {
                'font-size': '.85em'
            },
            priority: 5
        }
    },
    big: {
        title: 'Big',
        model: 'big',
        view: {
            name: 'span',
            styles: {
                'font-size': '1.4em'
            },
            priority: 5
        }
    },
    huge: {
        title: 'Huge',
        model: 'huge',
        view: {
            name: 'span',
            styles: {
                'font-size': '1.8em'
            },
            priority: 5
        }
    }
};

function getOptionDefinition( option ) {
    if ( typeof option === 'object' ) {
        return option;
    }

    if ( namedPresets[ option ] ) {
        return namedPresets[ option ];
    }

    if ( option === 'default' ) {
        return {
            model: undefined,
            title: 'Default font size'
        };
    }

    const sizePreset = parseFloat( option );

    if ( isNaN( sizePreset ) ) {
        return;
    }

    return generateEmPreset( sizePreset );
}

function generateEmPreset( size ) {
    const sizeName = String( size );

    return {
        title: sizeName,
        model: size,
        view: {
            name: 'span',
            styles: {
                'font-size': `${ size }em`
            },
            priority: 5
        }
    };
}