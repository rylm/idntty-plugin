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
        data: notifications.map(({ publicKey, forPublicKey, notificationType, data }) => ({
            public_key: publicKey,
            for_public_key: forPublicKey,
            type: notificationType,
            data: JSON.stringify(data),
        })),
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
    });
