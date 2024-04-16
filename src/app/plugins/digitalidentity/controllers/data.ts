import type { FastifyRequest, FastifyReply } from 'fastify';

import { saveEncryptedData, getEncryptedData } from '../database';

export const messageSend =
	() =>
	async (
		req: FastifyRequest<{
			Body: {
				publicKey: string;
				message: string;
				nonce: string;
			};
		}>,
		res: FastifyReply,
	) => {
		const { publicKey, message, nonce } = req.body;

		await saveEncryptedData({ publicKey, encryptedData: message, nonce });

		return res.send({ success: true });
	};

export const messageGet =
	() =>
	async (
		req: FastifyRequest<{
			Querystring: { publicKey: string };
		}>,
		res: FastifyReply,
	) => {
		const { publicKey } = req.query;

		const message = await getEncryptedData(publicKey);

		return res.send(message);
	};
