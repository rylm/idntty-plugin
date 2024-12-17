import { PrismaClient } from '@prisma/client';
// import { cryptography } from 'klayr-sdk';

const prisma = new PrismaClient();

export interface Notification {
    address: string;
    forAddress?: string;
    notificationType: string;
    data: Record<string, unknown>;
}

export const saveUserNotifications = async (notifications: Notification[]) =>
    prisma.notification.createMany({
        data: notifications.map(({ address, forAddress, notificationType, data }) => {
            const timestamp = new Date();
            return {
                public_key: address,
                for_public_key: forAddress,
                type: notificationType,
                data: JSON.stringify(data, (_, value) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    typeof value === 'bigint' ? value.toString() : value,
                ),
                timestamp,
            };
        }),
    });

export const getUserNotifications = async (address?: string, forAddress?: string) =>
    prisma.notification.findMany({
        where: {
            public_key: address,
            for_public_key: forAddress,
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
    or = false,
) => {
    const whereClause = or
        ? {
              OR: [{ public_key: publicKey }, { for_public_key: forPublicKey }],
          }
        : {
              public_key: publicKey,
              for_public_key: forPublicKey,
              type: transactionType,
              block_height: blockHeight,
              tx_id: txID,
          };
    return prisma.transaction.findMany({
        where: whereClause,
        orderBy: {
            timestamp: 'asc',
        },
    });
};
