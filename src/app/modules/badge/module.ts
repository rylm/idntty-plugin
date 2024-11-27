/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */

import { Modules } from 'klayr-sdk';
import { ArchiveBadgeCommand } from './commands/archive_badge_command';
import { ClaimBadgeCommand } from './commands/claim_badge_command';
import { CreateBadgeCommand } from './commands/create_badge_command';
import { IssueBadgeCommand } from './commands/issue_badge_command';
import { BadgeEndpoint } from './endpoint';
import { BadgeMethod } from './method';
import { NewBadgeIssuedEvent } from './events/newBadgeIssued';
import { AccountStore } from './stores/account';

import { IdentityMethod } from '../identity/method';

export class BadgeModule extends Modules.BaseModule {
    private _identityMethod!: IdentityMethod;
    private readonly _createBadgeCommand = new CreateBadgeCommand(this.stores, this.events);
    private readonly _archiveBadgeCommand = new ArchiveBadgeCommand(this.stores, this.events);
    private readonly _issueBadgeCommand = new IssueBadgeCommand(this.stores, this.events);

    public endpoint = new BadgeEndpoint(this.stores, this.offchainStores);
    public method = new BadgeMethod(this.stores, this.events);
    public commands = [
        this._createBadgeCommand,
        this._archiveBadgeCommand,
        this._issueBadgeCommand,
        new ClaimBadgeCommand(this.stores, this.events),
    ];

    public addDependencies(identityMethod: IdentityMethod) {
        this._identityMethod = identityMethod;
    }

    public constructor() {
        super();
        this.stores.register(AccountStore, new AccountStore(this.name, 0));

        this.events.register(NewBadgeIssuedEvent, new NewBadgeIssuedEvent(this.name));
    }

    public metadata(): Modules.ModuleMetadata {
        return {
            ...this.baseMetadata(),
            endpoints: [],
            assets: [],
        };
    }

    // Lifecycle hooks
    public async init(_args: Modules.ModuleInitArgs): Promise<void> {
        // initialize this module when starting a node
        this._createBadgeCommand.init({ method: this._identityMethod });
        this._archiveBadgeCommand.init({ method: this._identityMethod });
        this._issueBadgeCommand.init({ method: this._identityMethod });
    }

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
