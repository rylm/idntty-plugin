// export const configSchema = {
//     $id: '/identity/config',
//     title: 'Identity module account schema',
//     type: 'object',
//     properties: {
//         features: {
//             fieldNumber: 1,
//             type: 'array',
//             maxItems: 256,
//             items: {
//                 type: 'object',
//                 required: ['label', 'value'],
//                 properties: {
//                     label: { fieldNumber: 1, dataType: 'string' },
//                     value: { fieldNumber: 2, dataType: 'string' },
//                 },
//             },
//         },
//         verifications: {
//             fieldNumber: 2,
//             type: 'array',
//             items: {
//                 type: 'object',
//                 required: ['label', 'account', 'tx'],
//                 properties: {
//                     label: { fieldNumber: 1, dataType: 'string' },
//                     account: { fieldNumber: 2, dataType: 'bytes' },
//                     tx: { fieldNumber: 3, dataType: 'bytes' },
//                 },
//             },
//         },
//     },
//     default: { features: [], verifications: [] },
// };

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

export const createHelloSchema = {
    $id: 'identity/createHello-params',
    title: 'CreateHelloCommand transaction parameter for the Hello module',
    type: 'object',
    required: ['message', 'label', 'value'],
    properties: {
        message: {
            dataType: 'string',
            fieldNumber: 1,
            minLength: 3,
            maxLength: 256,
        },
        label: {
            dataType: 'string',
            fieldNumber: 2,
            minLength: 3,
            maxLength: 256,
        },
        value: {
            dataType: 'string',
            fieldNumber: 3,
            minLength: 3,
            maxLength: 256,
        },
    },
};

export const invalidateFeatureSchema = {};
export const removeFeatureSchema = {};
export const validateFeatureSchema = {};
