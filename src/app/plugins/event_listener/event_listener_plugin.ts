import { BasePlugin } from 'lisk-sdk';

export class EventListenerPlugin extends BasePlugin {
    public get nodeModulePath(): string {
        return __filename;
    }

    public async load(): Promise<void> {
        this.apiClient.subscribe('network_newBlock', data => {
            const blockData = data as { blockHeader: { id: string } };
            this.apiClient
                .invoke('chain_getBlockByID', { id: blockData.blockHeader.id })
                .then(block => {
                    console.log('NEW BLOCK:', block);
                })
                .catch(console.error);
        });
    }

    public async unload(): Promise<void> {}
}
