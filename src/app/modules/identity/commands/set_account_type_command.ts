import { Modules, StateMachine } from 'klayr-sdk';
import { inspect } from 'util';

import { AccountStore } from '../stores/account';
import { setAccountTypeSchema } from '../schema';

interface Params {
    isAuthority: boolean;
}

export class SetAccountTypeCommand extends Modules.BaseCommand {
    public schema = setAccountTypeSchema;

    public async verify(
        _context: StateMachine.CommandVerifyContext<Params>,
    ): Promise<StateMachine.VerificationResult> {
        return { status: StateMachine.VerifyStatus.OK };
    }

    public async execute(_context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
        const { isAuthority } = _context.params;
        const { senderAddress } = _context.transaction;
        const accountSubstore = this.stores.get(AccountStore);

        const account = await accountSubstore.get(_context, senderAddress);

        accountSubstore.set(_context, senderAddress, {
            ...account,
            isAuthority,
        });

        console.log(
            inspect(await accountSubstore.get(_context, senderAddress), {
                depth: null,
                colors: true,
            }),
        );
    }
}
