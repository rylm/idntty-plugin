import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';

import { createBadgeSchema } from '../schema';
import { IdentityMethod } from '../../identity/method';
import { AccountStore } from '../stores/account';

interface Params {
    id: string;
}

export class CreateBadgeCommand extends BaseCommand {
    public schema = createBadgeSchema;
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

        const { id } = _context.params;
        const { senderAddress } = _context.transaction;
        const accountStore = this.stores.get(AccountStore);
        const account = await accountStore.get(_context, senderAddress);
        if (account.credentials.find(c => c.id === id)) {
            return { status: VerifyStatus.FAIL, error: new Error('Badge already exists') };
        }

        return { status: VerifyStatus.OK };
    }

    public async execute(_context: CommandExecuteContext<Params>): Promise<void> {
        const { id } = _context.params;
        const { senderAddress } = _context.transaction;
        const accountStore = this.stores.get(AccountStore);
        const account = await accountStore.get(_context, senderAddress);

        await accountStore.set(_context, senderAddress, {
            ...account,
            credentials: [...account.credentials, { id }],
        });
    }
}
