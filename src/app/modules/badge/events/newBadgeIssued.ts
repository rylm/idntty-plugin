import { BaseEvent } from 'lisk-sdk';

export interface NewBadgeIssuedEventData {
    recipientAddress: string;
    ids: string[];
}

export const newBadgeIssuedEventSchema = {
    $id: 'badge/events/newBadgeIssued',
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

export class NewBadgeIssuedEvent extends BaseEvent<NewBadgeIssuedEventData> {
    public schema = newBadgeIssuedEventSchema;
}
