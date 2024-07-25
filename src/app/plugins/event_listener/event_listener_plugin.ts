import { BasePlugin } from 'lisk-sdk';
import type { BlockJSON } from '@liskhq/lisk-api-client/dist-node/types';

export class EventListenerPlugin extends BasePlugin {
    public get nodeModulePath(): string {
        return __filename;
    }

    public async load(): Promise<void> {
        this.apiClient.subscribe('network_newBlock', data => {
            const blockData = data as { blockHeader: { id: string } };
            this.apiClient
                .invoke('chain_getBlockByID', { id: blockData.blockHeader.id })
                .then(encodedBlock => {
                    const block = this.apiClient.block.fromJSON(
                        encodedBlock as unknown as BlockJSON,
                    );
                    console.log('New block:', block);
                })
                .catch(console.error);
        });
    }

    public async unload(): Promise<void> {}
}
