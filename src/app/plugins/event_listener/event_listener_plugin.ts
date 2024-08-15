import { BasePlugin } from 'lisk-sdk';
import type { BlockJSON } from '@liskhq/lisk-api-client/dist-node/types';
import { inspect } from 'util';

import { saveUserTransactions } from './database';

export class EventListenerPlugin extends BasePlugin {
    public get nodeModulePath(): string {
        return __filename;
    }

    public async load(): Promise<void> {
        this.apiClient.subscribe('network_newBlock', async data => {
            const blockData = data as { blockHeader: { id: string } };
            const encodedBlock = await this.apiClient.invoke('chain_getBlockByID', {
                id: blockData.blockHeader.id,
            });
            const block = this.apiClient.block.fromJSON(encodedBlock as unknown as BlockJSON);
            console.log('New block:', inspect(block, { depth: null, colors: true }));
            await saveUserTransactions(
                block.transactions.map(tx => ({
                    publicKey: tx.senderPublicKey.toString('hex'),
                    forPublicKey: ['validateFeature', 'invalidateFeature'].includes(tx.command)
                        ? (tx.params.recipientAddress as string)
                        : undefined,
                    transactionType: tx.command,
                    blockHeight: block.header.height,
                    price: tx.fee,
                    txID: tx.id.toString('hex'),
                    data: tx.params,
                })),
            );
        });
    }

    public async unload(): Promise<void> {}
}
