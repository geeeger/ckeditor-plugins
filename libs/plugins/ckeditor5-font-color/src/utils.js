/**
 * @fileOverview utils
 * @description 设置字体颜色filter
 */
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
            title: 'Default color',
            model: undefined
        };
    }

    // Ignore values that we cannot parse to a definition.
    if ( typeof option !== 'string' ) {
        return;
    }

    return generateColorPreset( option );
}

function generateColorPreset( fontDefinition ) {
    return {
        title: fontDefinition,
        model: fontDefinition.toLowerCase(),
        view: {
            name: 'span',
            styles: {
                'color': fontDefinition.toLowerCase()
            },
            priority: 6
        }
    };
}