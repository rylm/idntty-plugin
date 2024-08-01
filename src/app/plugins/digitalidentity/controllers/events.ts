import type { FastifyRequest, FastifyReply } from 'fastify';

import { getUserNotifications } from '../../event_listener/database';

export const getNotifications =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey?: string; forPublicKey?: string; notificationType?: string };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey, forPublicKey, notificationType } = req.query;

        const notifications = await getUserNotifications(publicKey, forPublicKey, notificationType);

        return res.send(notifications);
    };
