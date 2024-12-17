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
    getBadgeTags,
    addBadgeTags,
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
            Querystring: { address: string };
        }>,
        res: FastifyReply,
    ) => {
        const { address } = req.query;

        const layout = await getUserLayout(address);

        return res.send(layout);
    };

export const updateLayout =
    () =>
    async (
        req: FastifyRequest<{
            Body: {
                publicKey: string;
                address: string;
                layout: object;
            };
        }>,
        res: FastifyReply,
    ) => {
        const { address, layout } = req.body;

        await updateUserLayout({ address, layout });

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
            Querystring: { address: string };
        }>,
        res: FastifyReply,
    ) => {
        const { address } = req.query;

        const data = await getPublicUserDataEntry(address);

        return res.send(data);
    };

export const getSharedData =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey: string; address: string; forPublicKey: string };
        }>,
        res: FastifyReply,
    ) => {
        const { address, forPublicKey } = req.query;

        const data = await getSharedUserDataEntry(address, forPublicKey);

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
            Querystring: { address: string };
        }>,
        res: FastifyReply,
    ) => {
        const { address } = req.query;

        const isAuthority = await getIsAuthority(address);

        return res.send({ isAuthority });
    };

export const getCollections =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { address: string };
        }>,
        res: FastifyReply,
    ) => {
        const { address } = req.query;

        const collections = await getBadgeCollections(address);

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

export const getTags =
    () =>
    async (
        req: FastifyRequest<{
            Querystring: { publicKey: string };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey } = req.query;

        const tags = await getBadgeTags(publicKey);

        return res.send(tags);
    };

export const addTags =
    () =>
    async (
        req: FastifyRequest<{
            Body: {
                publicKey: string;
                tags: string[];
            };
        }>,
        res: FastifyReply,
    ) => {
        const { publicKey, tags } = req.body;

        await addBadgeTags(publicKey, tags);

        return res.send({ success: true });
    };
