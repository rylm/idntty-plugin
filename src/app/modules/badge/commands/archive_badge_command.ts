import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';

import { archiveBadgeSchema } from '../schema';
import { IdentityMethod } from '../../identity/method';
import { AccountStore } from '../stores/account';

interface Params {
    ids: string[];
}

export class ArchiveBadgeCommand extends BaseCommand {
    public schema = archiveBadgeSchema;
    private _method!: IdentityMethod;

    public init(args: { method: IdentityMethod }) {
        this._method = args.method;
    }

    public async verify(_context: CommandVerifyContext<Params>): Promise<VerificationResult> {
        const isAuthority = await this._method.getAccountType(
            _context.getMethodContext(),
            _context.transaction.senderAddress,
        );

        if (!isAuthority) {
            return { status: VerifyStatus.FAIL, error: new Error('Sender is not an authority') };
        }

        return { status: VerifyStatus.OK };
    }

    public async execute(_context: CommandExecuteContext<Params>): Promise<void> {
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
