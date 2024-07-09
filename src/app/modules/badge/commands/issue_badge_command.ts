import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
    cryptography,
} from 'lisk-sdk';

import { issueBadgeSchema } from '../schema';
import { IdentityMethod } from '../../identity/method';
import { AccountStore } from '../stores/account';

interface Params {
    recipientAddress: string;
    ids: string[];
}

export class IssueBadgeCommand extends BaseCommand {
    public schema = issueBadgeSchema;
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
        const { recipientAddress, ids } = _context.params;
        const { id } = _context.transaction;
        const accountStore = this.stores.get(AccountStore);

        cryptography.address.validateLisk32Address(recipientAddress);

        const recipientAccount = await accountStore.get(
            _context,
            cryptography.address.getAddressFromLisk32Address(recipientAddress),
        );

        if (!recipientAccount) {
            throw new Error('Recipient account does not exist');
        }

        await accountStore.set(
            _context,
            cryptography.address.getAddressFromLisk32Address(recipientAddress),
            {
                ...recipientAccount,
                awards: [
                    ...recipientAccount.awards,
                    ...ids.map(credentialId => ({ id: credentialId, tx: id.toString('hex') })),
                ],
            },
        );
    }
}
