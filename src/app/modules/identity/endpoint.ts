import { Modules, Types, cryptography } from 'klayr-sdk';
import { AccountStore, AccountStoreData } from './stores/account';

export class IdentityEndpoint extends Modules.BaseEndpoint {
    public async getAccount(ctx: Types.ModuleEndpointContext): Promise<AccountStoreData> {
        const accountSubstore = this.stores.get(AccountStore);
        const { address } = ctx.params;

        if (typeof address !== 'string') {
            throw new Error('Parameter address must be a string');
        }

        cryptography.address.validateKlayr32Address(address);

        const account = await accountSubstore.get(
            ctx,
            cryptography.address.getAddressFromKlayr32Address(address),
        );

        return account;
    }

    public async getAllAccounts(ctx: Types.ModuleEndpointContext): Promise<
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
}
