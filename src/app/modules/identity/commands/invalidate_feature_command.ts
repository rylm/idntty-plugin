/* eslint-disable class-methods-use-this */

import { Modules, StateMachine, cryptography } from 'klayr-sdk';

import { AccountStore } from '../stores/account';
import { invalidateFeatureSchema } from '../schema';

interface Params {
    recipientAddress: string;
    features: {
        label: string;
    }[];
}

export class InvalidateFeatureCommand extends Modules.BaseCommand {
    public schema = invalidateFeatureSchema;

    public async verify(
        _context: StateMachine.CommandVerifyContext<Params>,
    ): Promise<StateMachine.VerificationResult> {
        const { params } = _context;

        const uniqueLabels: string[] = [];
        params.features.forEach(feature => {
            if (uniqueLabels.includes(feature.label)) {
                throw new Error('Transaction validation error: Labels mast be unique');
            } else {
                uniqueLabels.push(feature.label);
            }
        });

        return { status: StateMachine.VerifyStatus.OK };
    }

    public async execute(_context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
        const { senderAddress } = _context.transaction;
        const { recipientAddress, features } = _context.params;
        const accountSubstore = this.stores.get(AccountStore);

        cryptography.address.validateKlayr32Address(recipientAddress);

        const recipientAccount = await accountSubstore.get(
            _context,
            cryptography.address.getAddressFromKlayr32Address(recipientAddress),
        );

        if (!recipientAccount) {
            throw new Error(
                `State modification error: Account does not exist for recipientAddress: ${recipientAddress}`,
            );
        }

        features.forEach(feature => {
            let isValidated = true;
            recipientAccount.verifications.forEach((verification, index) => {
                if (
                    feature.label === verification.label &&
                    senderAddress.toString('hex') === verification.account
                ) {
                    accountSubstore.set(
                        _context,
                        cryptography.address.getAddressFromKlayr32Address(recipientAddress),
                        {
                            ...recipientAccount,
                            verifications: [
                                ...recipientAccount.verifications.slice(0, index),
                                ...recipientAccount.verifications.slice(index + 1),
                            ],
                        },
                    );
                    isValidated = false;
                }
            });

            if (isValidated) {
                throw new Error(
                    `State modification error: Nothing to invalidate for: ${senderAddress.toString(
                        'hex',
                    )} with label: ${feature.label}`,
                );
            }
        });
    }
}
