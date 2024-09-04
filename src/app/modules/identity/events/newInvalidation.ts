import { BaseEvent } from 'lisk-sdk';

export interface NewInvalidationEventData {
    recipientAddress: string;
    features: {
        label: string;
    }[];
}

export const newInvalidationEventSchema = {
    $id: 'identity/events/newInvalidation',
    type: 'object',
    required: ['recipientAddress', 'features'],
    properties: {
        recipientAddress: { fieldNumber: 1, dataType: 'string', minLength: 41, maxLength: 42 },
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

export class NewInvalidationEvent extends BaseEvent<NewInvalidationEventData> {
    public schema = newInvalidationEventSchema;
}
