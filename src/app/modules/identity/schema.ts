export const configSchema = {
    $id: '/identity/config',
    title: 'Identity module account schema',
    type: 'object',
    properties: {
        features: {
            fieldNumber: 1,
            type: 'array',
            maxItems: 256,
            items: {
                type: 'object',
                required: ['label', 'value'],
                properties: {
                    label: { fieldNumber: 1, dataType: 'string' },
                    value: { fieldNumber: 2, dataType: 'string' },
                },
            },
        },
        verifications: {
            fieldNumber: 2,
            type: 'array',
            items: {
                type: 'object',
                required: ['label', 'account', 'tx'],
                properties: {
                    label: { fieldNumber: 1, dataType: 'string' },
                    account: { fieldNumber: 2, dataType: 'bytes' },
                    tx: { fieldNumber: 3, dataType: 'bytes' },
                },
            },
        },
    },
    default: { features: [], verifications: [] },
};

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

export const invalidateFeatureSchema = {};
export const removeFeatureSchema = {};
export const validateFeatureSchema = {};
