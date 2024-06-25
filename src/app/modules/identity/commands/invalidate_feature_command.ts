/* eslint-disable class-methods-use-this */

import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
    cryptography,
} from 'lisk-sdk';

import { AccountStore } from '../stores/account';
import { invalidateFeatureSchema } from '../schema';

interface Params {
    recipientAddress: string;
    features: {
        label: string;
    }[];
}

export class InvalidateFeatureCommand extends BaseCommand {
    public schema = invalidateFeatureSchema;

    public async verify(_context: CommandVerifyContext<Params>): Promise<VerificationResult> {
        const { params } = _context;

        const uniqueLabels: string[] = [];
        params.features.forEach(feature => {
            if (uniqueLabels.includes(feature.label)) {
                throw new Error('Transaction validation error: Labels mast be unique');
            } else {
                uniqueLabels.push(feature.label);
            }
        });

        return { status: VerifyStatus.OK };
    }

    public async execute(_context: CommandExecuteContext<Params>): Promise<void> {
        const { senderAddress } = _context.transaction;
        const { recipientAddress, features } = _context.params;
        const accountSubstore = this.stores.get(AccountStore);

        cryptography.address.validateLisk32Address(recipientAddress);

        const recipientAccount = await accountSubstore.get(
            _context,
            cryptography.address.getAddressFromLisk32Address(recipientAddress),
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
                        cryptography.address.getAddressFromLisk32Address(recipientAddress),
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
