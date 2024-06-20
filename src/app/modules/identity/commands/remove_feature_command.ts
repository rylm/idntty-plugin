/* eslint-disable class-methods-use-this */

import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';

import { AccountStore } from '../stores/account';

import { removeFeatureSchema } from '../schema';

interface Params {
    features: {
        label: string;
    }[];
}

export class RemoveFeatureCommand extends BaseCommand {
    public schema = removeFeatureSchema;

    // eslint-disable-next-line @typescript-eslint/require-await
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
        const { features } = _context.params;
        const { senderAddress } = _context.transaction;
        const accountSubstore = this.stores.get(AccountStore);

        for (const feature of features) {
            let doesFeatureExist = false;

            const accountFeatures = (await accountSubstore.get(_context, senderAddress)).features;
            for (const accountFeature of accountFeatures) {
                if (feature.label === accountFeature.label) {
                    doesFeatureExist = true;
                    break;
                }
            }

            if (!doesFeatureExist) {
                throw new Error(
                    'State modification error: Unable to delete a feature that does not exist',
                );
            }

            const newFeatures = accountFeatures.filter(
                accountFeature => accountFeature.label !== feature.label,
            );
            await accountSubstore.set(_context, senderAddress, { features: newFeatures });

            // deal with validations
        }
    }
}
