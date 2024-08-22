import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';
import { inspect } from 'util';

import { AccountStore } from '../stores/account';
import { setAccountTypeSchema } from '../schema';

interface Params {
    isAuthority: boolean;
}

export class SetAccountTypeCommand extends BaseCommand {
    public schema = setAccountTypeSchema;

    public async verify(_context: CommandVerifyContext<Params>): Promise<VerificationResult> {
        return { status: VerifyStatus.OK };
    }

    public async execute(_context: CommandExecuteContext<Params>): Promise<void> {
        console.log('SetAccountTypeCommand: ', inspect(_context, { depth: null, colors: true }));
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
