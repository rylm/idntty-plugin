import { Modules, StateMachine } from 'klayr-sdk';

import { archiveBadgeSchema } from '../schema';
import { IdentityMethod } from '../../identity/method';
import { AccountStore } from '../stores/account';

interface Params {
    ids: string[];
}

export class ArchiveBadgeCommand extends Modules.BaseCommand {
    public schema = archiveBadgeSchema;
    // private _method!: IdentityMethod;

    public init(_args: { method: IdentityMethod }) {
        // this._method = args.method;
    }

    public async verify(
        _context: StateMachine.CommandVerifyContext<Params>,
    ): Promise<StateMachine.VerificationResult> {
        // const isAuthority = await this._method.getAccountType(
        //     _context.getMethodContext(),
        //     _context.transaction.senderAddress,
        // );

        // if (!isAuthority) {
        //     return { status: VerifyStatus.FAIL, error: new Error('Sender is not an authority') };
        // }

        return { status: StateMachine.VerifyStatus.OK };
    }

    public async execute(_context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
        const { ids } = _context.params;
        const { senderAddress } = _context.transaction;
        const accountStore = this.stores.get(AccountStore);
        const account = await accountStore.get(_context, senderAddress);

        await accountStore.set(_context, senderAddress, {
            ...account,
            credentials: account.credentials.filter(c => !ids.includes(c.id)),
        });
    }
}
