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
                    value: { fieldNumber: 2, dataType: 'bytes' },
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
