import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveNotification = async (
    publicKey: string,
    notificationType: string,
    data: Record<string, unknown>,
) =>
    prisma.notification.create({
        data: {
            public_key: publicKey,
            type: notificationType,
            data: JSON.stringify(data),
        },
    });
