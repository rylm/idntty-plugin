import type { FastifyRequest, FastifyReply } from 'fastify';
import { isWithinInterval } from 'date-fns';

import { getUserNotifications } from '../../event_listener/database';

export const getNotifications =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: {
                publicKey?: string;
                forPublicKey?: string;
                notificationType?: string;
                startDate?: number;
                endDate?: number;
                amount?: number;
            };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey, forPublicKey, startDate, endDate, amount } = req.query;

        if (amount && startDate && endDate) {
            return res.status(400).send('Amount, startDate and endDate cannot be used together');
        }

        const notifications = await getUserNotifications(publicKey, forPublicKey, 'share');

        if (amount) {
            return res.send(notifications.slice(-amount));
        }

        if (!startDate || !endDate) {
            return res.send(notifications);
        }

        return res.send(
            notifications.filter(notification =>
                isWithinInterval(notification.timestamp, {
                    start: new Date(startDate * 1000),
                    end: new Date(endDate * 1000),
                }),
            ),
        );
    };
