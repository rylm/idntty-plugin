import { BasePlugin } from 'lisk-sdk';
import type { FastifyRequest, FastifyReply } from 'fastify';

export const get =
    (apiClient: BasePlugin['apiClient']) =>
    async (
        req: FastifyRequest<{ Querystring: { address: string } }>,
        res: FastifyReply,
    ): Promise<void> => {
        const { address } = req.query;

        try {
            const account = await apiClient.invoke('identity_getAccount', { address });
            res.send(account);
        } catch (error) {
            res.status(500).send({ error });
        }
    };

export const getBalance =
    (apiClient: BasePlugin['apiClient']) =>
    async (
        req: FastifyRequest<{ Querystring: { address: string } }>,
        res: FastifyReply,
    ): Promise<void> => {
        const { address } = req.query;

        try {
            const balances = await apiClient.invoke('token_getBalance', {
                address,
                tokenID: 'abcdef0100000000',
            });
            res.send(balances);
        } catch (error) {
            res.status(500).send({ error });
        }
    };
