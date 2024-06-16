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

        for (const feature of features) {
            let isUnique = true;

            const accountFeatures = (await accountSubstore.get(_context, senderAddress)).features;
            for (const accountFeature of accountFeatures) {
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
                    await accountSubstore.set(_context, senderAddress, {
                        features: accountFeatures.map(f =>
                            f.label === feature.label ? feature : f,
                        ),
                    });
                }
            }

            if (isUnique) {
                await accountSubstore.set(_context, senderAddress, {
                    features: [...accountFeatures, feature],
                });
            } else {
                // Delete validated features for updated
            }

            _context.logger.info(await accountSubstore.iterate(_context, {}));
        }
    }
}
