import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Notification {
    publicKey: string;
    notificationType: string;
    data: Record<string, unknown>;
}

export const saveNotifications = async (notifications: Notification[]) =>
    prisma.notification.createMany({
        data: notifications.map(({ publicKey, notificationType, data }) => ({
            public_key: publicKey,
            type: notificationType,
            data: JSON.stringify(data),
        })),
    });
