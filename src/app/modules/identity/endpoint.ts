import { BaseEndpoint, ModuleEndpointContext, cryptography } from 'lisk-sdk';
import { AccountStore, AccountStoreData } from './stores/account';
import { MessageStore, MessageStoreData } from './stores/message';

export class IdentityEndpoint extends BaseEndpoint {
    public async getAccount(ctx: ModuleEndpointContext): Promise<AccountStoreData> {
        const accountSubstore = this.stores.get(AccountStore);
        const { address } = ctx.params;

        if (typeof address !== 'string') {
            throw new Error('Parameter address must be a string');
        }

        cryptography.address.validateLisk32Address(address);

        const account = await accountSubstore.get(
            ctx,
            cryptography.address.getAddressFromLisk32Address(address),
        );

        return account;
    }

    public async getAllAccounts(ctx: ModuleEndpointContext): Promise<
        {
            key: Buffer;
            value: AccountStoreData;
        }[]
    > {
        const accountSubstore = this.stores.get(AccountStore);

        console.log('Got accountSubstore: ', accountSubstore);

        const options = {
            limit: 10,
            gte: Buffer.from(new Uint8Array([0])),
            lte: Buffer.from(new Uint8Array(new Array(256).fill(255))),
        };

        console.log('Options: ', options);

        const accounts = await accountSubstore.iterate(ctx, options);

        console.log('Got accounts: ', accounts);

        return accounts;
    }

    public async getHello(ctx: ModuleEndpointContext): Promise<MessageStoreData> {
        const messageSubStore = this.stores.get(MessageStore);

        const { address } = ctx.params;
        if (typeof address !== 'string') {
            throw new Error('Parameter address must be a string.');
        }
        cryptography.address.validateLisk32Address(address);
        const helloMessage = await messageSubStore.get(
            ctx,
            cryptography.address.getAddressFromLisk32Address(address),
        );
        return helloMessage;
    }
}
