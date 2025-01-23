import { Plugins, cryptography } from 'klayr-sdk';
import type { BlockJSON } from '@klayr/api-client/dist-node/types';
import { inspect } from 'util';

import { saveUserTransactions, saveUserNotifications } from './database';

export class EventListenerPlugin extends Plugins.BasePlugin {
    public get nodeModulePath(): string {
        return __filename;
    }

    public async load(): Promise<void> {
        this.apiClient.subscribe('network_newBlock', async data => {
            const blockData = data as { blockHeader: { height: number } };
            const encodedBlock = await this.apiClient.invoke('chain_getBlockByHeight', {
                height: blockData.blockHeader.height,
            });
            const block = this.apiClient.block.fromJSON(encodedBlock as unknown as BlockJSON);
            console.log('New block:', inspect(block, { depth: null, colors: true }));
            await saveUserTransactions(
                block.transactions.map(tx => {
                    let forPublicKey: string | undefined;
                    if (
                        ['validateFeature', 'invalidateFeature', 'issueBadge'].includes(tx.command)
                    ) {
                        forPublicKey = tx.params.recipientAddress as string;
                    } else if (tx.command === 'transfer') {
                        forPublicKey = cryptography.address.getKlayr32AddressFromAddress(
                            tx.params.recipientAddress as Buffer,
                        );
                    }
                    return {
                        publicKey: tx.senderPublicKey.toString('hex'),
                        forPublicKey,
                        transactionType: tx.command,
                        blockHeight: block.header.height,
                        price: tx.fee,
                        txID: tx.id.toString('hex'),
                        data: tx.params,
                    };
                }),
            );
            await saveUserNotifications(
                block.transactions
                    .filter(tx => tx.command === 'issueBadge')
                    .map(tx => ({
                        address: cryptography.address.getKlayr32AddressFromPublicKey(
                            tx.senderPublicKey,
                        ),
                        forAddress: cryptography.address.getKlayr32AddressFromAddress(
                            Buffer.from(tx.params.recipientAddress as string, 'hex'),
                        ),
                        notificationType: 'issueBadge',
                        data: tx.params,
                    })),
            );
        });
    }

    public async unload(): Promise<void> {}
}
