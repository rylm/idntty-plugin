import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Notification {
    publicKey: string;
    forPublicKey?: string;
    notificationType: string;
    data: Record<string, unknown>;
}

export const saveUserNotifications = async (notifications: Notification[]) =>
    prisma.notification.createMany({
        data: notifications.map(({ publicKey, forPublicKey, notificationType, data }) => {
            const timestamp = new Date();
            return {
                public_key: publicKey,
                for_public_key: forPublicKey,
                type: notificationType,
                data: JSON.stringify(data, (_, value) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    typeof value === 'bigint' ? value.toString() : value,
                ),
                timestamp,
            };
        }),
    });

export const getUserNotifications = async (
    publicKey?: string,
    forPublicKey?: string,
    notificationType?: string,
) =>
    prisma.notification.findMany({
        where: {
            public_key: publicKey,
            for_public_key: forPublicKey,
            type: notificationType,
        },
        orderBy: {
            timestamp: 'asc',
        },
    });

export interface Transaction {
    publicKey: string;
    forPublicKey?: string;
    transactionType: string;
    blockHeight: number;
    price: bigint;
    txID: string;
    data: Record<string, unknown>;
}

export const saveUserTransactions = async (transactions: Transaction[]) =>
    prisma.transaction.createMany({
        data: transactions.map(
            ({ publicKey, forPublicKey, transactionType, blockHeight, price, txID, data }) => {
                const timestamp = new Date();
                return {
                    public_key: publicKey,
                    for_public_key: forPublicKey,
                    type: transactionType,
                    block_height: blockHeight,
                    price,
                    tx_id: txID,
                    data: JSON.stringify(data, (_, value) =>
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        typeof value === 'bigint' ? value.toString() : value,
                    ),
                    timestamp,
                };
            },
        ),
    });

export const getUserTransactions = async (
    publicKey?: string,
    forPublicKey?: string,
    transactionType?: string,
    blockHeight?: number,
    txID?: string,
) =>
    prisma.transaction.findMany({
        where: {
            public_key: publicKey,
            for_public_key: forPublicKey,
            type: transactionType,
            block_height: blockHeight,
            tx_id: txID,
        },
        orderBy: {
            timestamp: 'asc',
        },
    });
