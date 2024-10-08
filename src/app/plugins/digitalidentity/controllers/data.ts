import type { FastifyRequest, FastifyReply } from 'fastify';

import {
    getUserLayout,
    updateUserLayout,
    getPrivateUserDataEntry,
    getPublicUserDataEntry,
    getSharedUserDataEntry,
    saveUserDataEntry,
    getIsAuthority,
    getBadgeCollections,
    addBadgeCollection,
} from '../database';

export interface DataEntry {
    uuid: string;
    value: string;
    nonce: string;
}
export const getLayout =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey: string };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey } = req.query;

        const layout = await getUserLayout(publicKey);

        return res.send(layout);
    };

export const updateLayout =
    () =>
    async (
        req: FastifyRequest<{
            Body: {
                publicKey: string;
                layout: object;
            };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey, layout } = req.body;

        await updateUserLayout({ publicKey, layout });

        return res.send({ success: true });
    };

export const getPrivateData =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey: string };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey } = req.query;

        const data = await getPrivateUserDataEntry(publicKey);

        return res.send(data);
    };

export const getPublicData =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey: string };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey } = req.query;

        const data = await getPublicUserDataEntry(publicKey);

        return res.send(data);
    };

export const getSharedData =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey: string; forPublicKey: string };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey, forPublicKey } = req.query;

        const data = await getSharedUserDataEntry(publicKey, forPublicKey);

        return res.send(data);
    };

export const saveData =
    () =>
    async (
        req: FastifyRequest<{
            Body: {
                publicKey: string;
                domains: string[];
                data: DataEntry[];
            };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey, domains, data } = req.body;

        await saveUserDataEntry({ publicKey, domains, data });

        return res.send({ success: true });
    };

export const getUserIdentity =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey: string };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey } = req.query;

        const isAuthority = await getIsAuthority(publicKey);

        return res.send({ isAuthority });
    };

export const getCollections =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey: string };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey } = req.query;

        const collections = await getBadgeCollections(publicKey);

        return res.send(collections);
    };

export const addCollection =
    () =>
    async (
        req: FastifyRequest<{
            Body: {
                publicKey: string;
                collection: string;
            };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey, collection } = req.body;

        await addBadgeCollection(publicKey, collection);

        return res.send({ success: true });
    };
