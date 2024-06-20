/* eslint-disable class-methods-use-this */

import {
    BaseCommand,
    CommandVerifyContext,
    CommandExecuteContext,
    VerificationResult,
    VerifyStatus,
} from 'lisk-sdk';

import { AccountStore } from '../stores/account';

import { setFeatureSchema } from '../schema';

interface Params {
    features: {
        label: string;
        value: string;
    }[];
}

export class SetFeatureCommand extends BaseCommand {
    public schema = setFeatureSchema;

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

        console.log('Features:', features);

        for (const feature of features) {
            let isUnique = true;

            console.log('Currently on feature:', feature);

            const accountFeatures = (await accountSubstore.get(_context, senderAddress)).features;

            console.log('Current account features:', accountFeatures);

            for (const accountFeature of accountFeatures) {
                console.log('Currently on account feature:', accountFeature);

                if (
                    feature.label === accountFeature.label &&
                    feature.value === accountFeature.value
                ) {
                    throw new Error(
                        'State modification error: The new value must be different from the existing',
                    );
                }
                if (feature.label === accountFeature.label) {
                    isUnique = false;
                    console.log('Feature already exists, updating it:', feature.label);
                    await accountSubstore.set(_context, senderAddress, {
                        features: accountFeatures.map(f =>
                            f.label === feature.label ? feature : f,
                        ),
                    });
                }
            }

            if (isUnique) {
                console.log('Feature is unique, adding it:', feature.label);
                await accountSubstore.set(_context, senderAddress, {
                    features: [...accountFeatures, feature],
                });
            } else {
                // Delete validated features for updated
            }
        }
    }
}
