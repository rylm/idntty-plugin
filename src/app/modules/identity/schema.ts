export const setFeatureSchema = {
    $id: 'identity/setFeature-params',
    title: 'Command schema to set or update account features for identity module',
    type: 'object',
    required: ['features'],
    properties: {
        features: {
            fieldNumber: 1,
            type: 'array',
            minItems: 1,
            maxItems: 16,
            items: {
                type: 'object',
                required: ['label', 'value'],
                properties: {
                    label: { fieldNumber: 1, dataType: 'string', maxLength: 16 },
                    value: { fieldNumber: 2, dataType: 'string', maxLength: 32 },
                },
            },
        },
    },
};

export const removeFeatureSchema = {
    $id: 'identity/removeFeature-params',
    title: 'Command schema to remove account features for identity module',
    type: 'object',
    required: ['features'],
    properties: {
        features: {
            fieldNumber: 1,
            type: 'array',
            minItems: 1,
            maxItems: 16,
            items: {
                type: 'object',
                required: ['label'],
                properties: {
                    label: { fieldNumber: 1, dataType: 'string', maxLength: 16 },
                },
            },
        },
    },
};

export const validateFeatureSchema = {
    $id: 'identity/validateFeature-params',
    title: 'Command schema to validate account features for identity module',
    type: 'object',
    required: ['recipientAddress', 'features'],
    properties: {
        recipientAddress: { fieldNumber: 1, dataType: 'string', minLength: 42, maxLength: 42 },
        features: {
            fieldNumber: 2,
            type: 'array',
            minItems: 1,
            maxItems: 16,
            items: {
                type: 'object',
                required: ['label', 'value'],
                properties: {
                    label: { fieldNumber: 1, dataType: 'string', maxLength: 16 },
                    value: { fieldNumber: 2, dataType: 'string', maxLength: 32 },
                },
            },
        },
    },
};

export const invalidateFeatureSchema = {
    $id: 'identity/invalidateFeature-params',
    title: 'Command schema to invalidate account features for identity module',
    type: 'object',
    required: ['recipientAddress', 'features'],
    properties: {
        recipientAddress: { fieldNumber: 1, dataType: 'string', minLength: 42, maxLength: 42 },
        features: {
            fieldNumber: 2,
            type: 'array',
            minItems: 1,
            maxItems: 16,
            items: {
                type: 'object',
                required: ['label'],
                properties: {
                    label: { fieldNumber: 1, dataType: 'string', maxLength: 16 },
                },
            },
        },
    },
};

export const setAccountTypeSchema = {
    $id: 'identity/setAccountType-params',
    title: 'Command schema to set account type for identity module',
    type: 'object',
    required: ['type'],
    properties: {
        isAuthority: { fieldNumber: 1, dataType: 'boolean' },
    },
};
