/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */

// import { validator } from '@liskhq/lisk-validator';
import { BaseModule, /* ModuleInitArgs, */ ModuleMetadata /* utils */ } from 'lisk-sdk';
import { InvalidateFeatureCommand } from './commands/invalidate_feature_command';
import { RemoveFeatureCommand } from './commands/remove_feature_command';
import { SetFeatureCommand } from './commands/set_feature_command';
import { ValidateFeatureCommand } from './commands/validate_feature_command';
import { IdentityEndpoint } from './endpoint';
import { IdentityMethod } from './method';
// import { configSchema } from './schema';
import { SetAccountTypeCommand } from './commands/set_account_type_command';
import { AccountStore } from './stores/account';

// import { ModuleConfigJSON } from './types';

export const defaultConfig = {
    features: [],
    verifications: [],
};

export class IdentityModule extends BaseModule {
    public endpoint = new IdentityEndpoint(this.stores, this.offchainStores);
    public method = new IdentityMethod(this.stores, this.events);
    public commands = [
        new SetFeatureCommand(this.stores, this.events),
        new InvalidateFeatureCommand(this.stores, this.events),
        new RemoveFeatureCommand(this.stores, this.events),
        new ValidateFeatureCommand(this.stores, this.events),
        new SetAccountTypeCommand(this.stores, this.events),
    ];

    public constructor() {
        super();
        this.stores.register(AccountStore, new AccountStore(this.name, 0));
    }

    public metadata(): ModuleMetadata {
        return {
            ...this.baseMetadata(),
            endpoints: [],
            assets: [],
        };
    }

    // Lifecycle hooks
    // public async init(_args: ModuleInitArgs): Promise<void> {
    //     const { moduleConfig } = _args;
    //     const config = utils.objects.mergeDeep({}, defaultConfig, moduleConfig) as ModuleConfigJSON;
    //     validator.validate<ModuleConfigJSON>(configSchema, config);
    // }

    // public async insertAssets(_context: InsertAssetContext) {
    // 	// initialize block generation, add asset
    // }

    // public async verifyAssets(_context: BlockVerifyContext): Promise<void> {
    // 	// verify block
    // }

    // Lifecycle hooks
    // public async verifyTransaction(_context: TransactionVerifyContext): Promise<VerificationResult> {
    // verify transaction will be called multiple times in the transaction pool
    // return { status: VerifyStatus.OK };
    // }

    // public async beforeCommandExecute(_context: TransactionExecuteContext): Promise<void> {
    // }

    // public async afterCommandExecute(_context: TransactionExecuteContext): Promise<void> {

    // }
    // public async initGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {

    // }

    // public async finalizeGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {

    // }

    // public async beforeTransactionsExecute(_context: BlockExecuteContext): Promise<void> {

    // }

    // public async afterTransactionsExecute(_context: BlockAfterExecuteContext): Promise<void> {

    // }
}
