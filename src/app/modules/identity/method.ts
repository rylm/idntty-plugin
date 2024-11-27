import { Modules, StateMachine } from 'klayr-sdk';
import { AccountStore } from './stores/account';

export class IdentityMethod extends Modules.BaseMethod {
    public async getAccountType(
        methodContext: StateMachine.ImmutableMethodContext,
        address: Buffer,
    ) {
        const accountStore = this.stores.get(AccountStore);

        const account = await accountStore.get(methodContext, address);

        return account.isAuthority;
    }
}
