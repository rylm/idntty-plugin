import { Modules } from 'klayr-sdk';

export interface AccountStoreData {
    features: {
        label: string;
        value: string;
    }[];
    verifications: {
        label: string;
        account: string;
        tx: string;
    }[];
    isAuthority: boolean;
}

export const accountStoreSchema = {
    $id: '/identity/account',
    type: 'object',
    required: ['features', 'isAuthority'],
    properties: {
        features: {
            fieldNumber: 1,
            type: 'array',
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
                    account: { fieldNumber: 2, dataType: 'string' },
                    tx: { fieldNumber: 3, dataType: 'string' },
                },
            },
        },
        isAuthority: { fieldNumber: 3, dataType: 'boolean' },
    },
};

export class AccountStore extends Modules.BaseStore<AccountStoreData> {
    public schema = accountStoreSchema;
}
