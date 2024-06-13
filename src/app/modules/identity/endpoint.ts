import { BaseEndpoint, ModuleEndpointContext, cryptography } from 'lisk-sdk';
import { AccountStore, AccountStoreData } from './stores/account';

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

        const accounts = await accountSubstore.iterate(ctx, {});

        return accounts;
    }
}
