import type { FastifyRequest, FastifyReply } from 'fastify';

import { getUserNotifications } from '../../event_listener/database';

export const getNotifications =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey: string };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey } = req.query;

        const notifications = await getUserNotifications(publicKey);

        return res.send(notifications);
    };
