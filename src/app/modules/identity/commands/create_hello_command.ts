import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';
import { createHelloSchema } from '../schema';
import { MessageStore } from '../stores/message';

interface Params {
    message: string;
}

export class CreateHelloCommand extends BaseCommand {
    public schema = createHelloSchema;

    // public async init(config: ModuleConfig): Promise<void> {
    // }

    public async verify(_context: CommandVerifyContext<Params>): Promise<VerificationResult> {
        return {
            status: VerifyStatus.OK,
        };
    }

    public async execute(context: CommandExecuteContext<Params>): Promise<void> {
        // 1. Get account data of the sender of the Hello transaction.
        const { senderAddress } = context.transaction;
        // 2. Get message and counter stores.
        const messageSubstore = this.stores.get(MessageStore);

        // 3. Save the Hello message to the message store, using the senderAddress as key, and the message as value.
        await messageSubstore.set(context, senderAddress, {
            message: context.params.message,
        });
    }
}
