/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */

import {
    BaseModule,
    ModuleMetadata
} from 'lisk-sdk';
import { ArchiveBadgeCommand } from "./commands/archive_badge_command";
import { AssignBadgeCommand } from "./commands/assign_badge_command";
import { CreateBadgeCommand } from "./commands/create_badge_command";
import { IssueBadgeCommand } from "./commands/issue_badge_command";
import { BadgeEndpoint } from './endpoint';
import { BadgeMethod } from './method';

export class BadgeModule extends BaseModule {
    public endpoint = new BadgeEndpoint(this.stores, this.offchainStores);
    public method = new BadgeMethod(this.stores, this.events);
    public commands = [new CreateBadgeCommand(this.stores, this.events), new ArchiveBadgeCommand(this.stores, this.events), new IssueBadgeCommand(this.stores, this.events), new AssignBadgeCommand(this.stores, this.events)];

	// public constructor() {
	// 	super();
	// 	// registeration of stores and events
	// }

	public metadata(): ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [],
			assets: [],
		};
	}

    // Lifecycle hooks
    // public async init(_args: ModuleInitArgs): Promise<void> {
	// 	// initialize this module when starting a node
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
