export function normalizeOptions( configuredOptions ) {
    // Convert options to objects.
    return configuredOptions
        .map( getOptionDefinition )
        // Filter out undefined values that `getOptionDefinition` might return.
        .filter( option => !!option );
}

function getOptionDefinition( option ) {
    if ( typeof option === 'object' ) {
        return option;
    }

    if ( option === 'default' ) {
        return {
            model: undefined,
            title: 'Default text indent'
        };
    }

    const sizePreset = parseInt( option );

    if ( isNaN( sizePreset ) ) {
        return;
    }

    return generateEmPreset( sizePreset );
}

function generateEmPreset( size ) {
    const sizeName = String( size );

    return {
        title: sizeName + '字符缩进',
        model: size,
        view: {
            key: 'style',
            value: {
                'text-indent': `${ size }em`
            }
        }
    };
}

export function buildDefinition(key, options ) {
    const definition = {
        model: {
            key: key,
            values: []
        },
        view: {}
    };

    for ( const option of options ) {
        definition.model.values.push( option.model );
        definition.view[ option.model ] = option.view;
    }

    return definition;
}