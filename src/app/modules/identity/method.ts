import { BaseMethod, ImmutableMethodContext } from 'lisk-sdk';
import { AccountStore } from './stores/account';

export class IdentityMethod extends BaseMethod {
    public async getAccountType(methodContext: ImmutableMethodContext, address: Buffer) {
        const accountStore = this.stores.get(AccountStore);

        const account = await accountStore.get(methodContext, address);

        return account.isAuthority;
    }
}
