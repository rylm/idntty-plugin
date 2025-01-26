/* eslint-disable class-methods-use-this */

import { Modules, StateMachine, cryptography } from 'klayr-sdk';

import { AccountStore, AccountStoreData } from '../stores/account';

import { setFeatureSchema } from '../schema';

interface Params {
    features: {
        label: string;
        value: string;
    }[];
}

export class SetFeatureCommand extends Modules.BaseCommand {
    public schema = setFeatureSchema;

    public async verify(
        _context: StateMachine.CommandVerifyContext<Params>,
    ): Promise<StateMachine.VerificationResult> {
        const { params, transaction } = _context;
        const accountSubstore = this.stores.get(AccountStore);

        let isAuthority = false;
        try {
            const account = await accountSubstore.get(_context, transaction.senderAddress);
            isAuthority = account.isAuthority;
        } catch (error) {
            console.log('Account not found, considering it to be an identity account');
        }

        if (isAuthority && transaction.fee < 1999000000) {
            return {
                status: StateMachine.VerifyStatus.FAIL,
                error: new Error(
                    'Fee is too low. Min fee for setFeature for authority accounts is 1999000000',
                ),
            };
        }

        if (!isAuthority && transaction.fee < 99000000) {
            return {
                status: StateMachine.VerifyStatus.FAIL,
                error: new Error('Fee is too low. Min fee for setFeature is 99000000'),
            };
        }

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
        const { features } = _context.params;
        const { senderAddress } = _context.transaction;
        const accountSubstore = this.stores.get(AccountStore);

        console.log('Sender address:', senderAddress.toString('hex'));
        console.log('Converted:', cryptography.address.getKlayr32AddressFromAddress(senderAddress));

        for (const feature of features) {
            let isUnique = true;

            console.log('Currently on feature:', feature);

            let account: AccountStoreData;
            try {
                account = await accountSubstore.get(_context, senderAddress);
                console.log('Current account features:', account.features);
            } catch (error) {
                console.error(error);
                console.log('Account not found, creating it for:', senderAddress);
                account = {
                    features: [],
                    verifications: [],
                    isAuthority: false,
                };
            }

            for (const accountFeature of account.features) {
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
                        ...account,
                        features: account.features.map(f =>
                            f.label === feature.label ? feature : f,
                        ),
                    });
                }
            }

            if (isUnique) {
                console.log('Feature is unique, adding it:', feature.label);
                await accountSubstore.set(_context, senderAddress, {
                    ...account,
                    features: [...account.features, feature],
                });
            } else {
                console.log('Removing verifications for feature:', feature);
                await accountSubstore.set(_context, senderAddress, {
                    ...account,
                    verifications: account.verifications.filter(v => v.label !== feature.label),
                });
            }
        }

        console.log('New account data:', await accountSubstore.get(_context, senderAddress));
    }
}
