import { BaseStore } from 'lisk-sdk';

export interface AccountStoreData {
    features: {
        label: string;
        value: Uint8Array;
    }[];
}

export const accountStoreSchema = {
    $id: '/identity/account',
    type: 'object',
    required: ['features'],
    properties: {
        features: {
            fieldNumber: 1,
            type: 'array',
            items: {
                type: 'object',
                required: ['label', 'value'],
                properties: {
                    label: { fieldNumber: 1, dataType: 'string' },
                    value: { fieldNumber: 2, dataType: 'bytes' },
                },
            },
        },
    },
};

export class AccountStore extends BaseStore<AccountStoreData> {
    public schema = accountStoreSchema;
}
