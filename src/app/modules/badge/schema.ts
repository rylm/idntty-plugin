export const createBadgeSchema = {
    $id: 'badge/createBadge-params',
    title: 'Command schema to create a new badge',
    type: 'object',
    required: ['id'],
    properties: {
        id: { fieldNumber: 1, dataType: 'string' },
    },
};

export const archiveBadgeSchema = {
    $id: 'badge/archiveBadge-params',
    title: 'Command schema to archive a badge',
    type: 'object',
    required: ['ids'],
    properties: {
        ids: {
            fieldNumber: 1,
            type: 'array',
            minItems: 1,
            maxItems: 16,
            items: { dataType: 'string' },
        },
    },
};

export const issueBadgeSchema = {
    $id: 'badge/issueBadge-params',
    title: 'Command schema to issue a badge',
    type: 'object',
    required: ['ids', 'recipientAddress'],
    properties: {
        recipientAddress: { fieldNumber: 1, dataType: 'string', minLength: 41, maxLength: 42 },
        ids: {
            fieldNumber: 2,
            type: 'array',
            minItems: 1,
            maxItems: 16,
            items: { dataType: 'string' },
        },
    },
};

export const claimBadgeSchema = {
    $id: 'badge/claimBadge-params',
    title: 'Command schema to claim a badge',
    type: 'object',
    required: ['ids'],
    properties: {
        ids: {
            fieldNumber: 1,
            type: 'array',
            minItems: 1,
            maxItems: 16,
            items: { dataType: 'string' },
        },
    },
};
