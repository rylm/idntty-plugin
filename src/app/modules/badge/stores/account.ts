import { Modules } from 'klayr-sdk';

export interface AccountStoreData {
    credentials: { id: string }[];
    awards: { id: string; tx: string }[];
}

export const accountStoreSchema = {
    $id: '/badge/account',
    type: 'object',
    required: ['credentials'],
    properties: {
        credentials: {
            type: 'array',
            fieldNumber: 1,
            items: {
                type: 'object',
                properties: {
                    id: {
                        dataType: 'string',
                        fieldNumber: 1,
                    },
                },
            },
        },
        awards: {
            type: 'array',
            fieldNumber: 2,
            items: {
                type: 'object',
                properties: {
                    id: {
                        dataType: 'string',
                        fieldNumber: 1,
                    },
                    tx: {
                        dataType: 'string',
                        fieldNumber: 2,
                    },
                },
            },
        },
    },
};

export class AccountStore extends Modules.BaseStore<AccountStoreData> {
    public schema = accountStoreSchema;
}
