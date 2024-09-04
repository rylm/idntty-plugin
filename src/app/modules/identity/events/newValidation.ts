import { BaseEvent } from 'lisk-sdk';

export interface NewValidationEventData {
    recipientAddress: string;
    features: {
        label: string;
        value: string;
    }[];
}

export const newValidationEventSchema = {
    $id: 'identity/events/newValidation',
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
                required: ['label', 'value'],
                properties: {
                    label: { fieldNumber: 1, dataType: 'string', maxLength: 16 },
                    value: { fieldNumber: 2, dataType: 'string', maxLength: 32 },
                },
            },
        },
    },
};

export class NewValidationEvent extends BaseEvent<NewValidationEventData> {
    public schema = newValidationEventSchema;
}
