/* eslint-disable class-methods-use-this */

import { Modules, StateMachine } from 'klayr-sdk';

import { claimBadgeSchema } from '../schema';

interface Params {
    ids: string[];
}

export class ClaimBadgeCommand extends Modules.BaseCommand {
    public schema = claimBadgeSchema;

    // eslint-disable-next-line @typescript-eslint/require-await
    public async verify(
        _context: StateMachine.CommandVerifyContext<Params>,
    ): Promise<StateMachine.VerificationResult> {
        return { status: StateMachine.VerifyStatus.OK };
    }

    public async execute(_context: StateMachine.CommandExecuteContext<Params>): Promise<void> {}
}
