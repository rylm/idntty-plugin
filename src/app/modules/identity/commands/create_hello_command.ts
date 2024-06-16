import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';
import { createHelloSchema } from '../schema';
import { MessageStore } from '../stores/message';
import { AccountStore } from '../stores/account';

interface Params {
    message: string;
    label: string;
    value: string;
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
        const { senderAddress } = context.transaction;
        const messageSubstore = this.stores.get(MessageStore);
        const accountSubstore = this.stores.get(AccountStore);

        await messageSubstore.set(context, senderAddress, {
            message: context.params.message,
        });

        await accountSubstore.set(context, senderAddress, {
            features: [
                {
                    label: context.params.label,
                    value: context.params.value,
                },
            ],
        });
    }
}
