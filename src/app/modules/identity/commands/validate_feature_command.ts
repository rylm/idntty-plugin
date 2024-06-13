/* eslint-disable class-methods-use-this */

import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Params {}

export class ValidateFeatureCommand extends BaseCommand {
    public schema = {
        $id: 'ValidateFeatureCommand',
        type: 'object',
        properties: {},
    };

    // eslint-disable-next-line @typescript-eslint/require-await
    public async verify(_context: CommandVerifyContext<Params>): Promise<VerificationResult> {
        return { status: VerifyStatus.OK };
    }

    public async execute(_context: CommandExecuteContext<Params>): Promise<void> {}
}
