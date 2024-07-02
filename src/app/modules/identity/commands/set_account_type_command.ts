import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';

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
        const { isAuthority } = _context.params;
        const { senderAddress } = _context.transaction;
        const accountSubstore = this.stores.get(AccountStore);

        const account = await accountSubstore.get(_context, senderAddress);

        accountSubstore.set(_context, senderAddress, {
            ...account,
            isAuthority,
        });
    }
}
