/* eslint-disable class-methods-use-this */

import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';

import { claimBadgeSchema } from '../schema';

interface Params {
    ids: string[];
}

export class ClaimBadgeCommand extends BaseCommand {
    public schema = claimBadgeSchema;

    // eslint-disable-next-line @typescript-eslint/require-await
    public async verify(_context: CommandVerifyContext<Params>): Promise<VerificationResult> {
        return { status: VerifyStatus.OK };
    }

    public async execute(_context: CommandExecuteContext<Params>): Promise<void> {}
}
