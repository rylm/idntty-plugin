import type { FastifyRequest, FastifyReply } from 'fastify';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { saveBadgeImage, getBadgeImagesByPublicKey } from '../database';
import { uuidv4 } from '../../../../lib/utils';

const s3Client = new S3Client({ region: 'eu-west-1' });

export const getUploadUrl =
	() =>
	async (
		req: FastifyRequest<{ Body: { userID: string; fileName: string; contentType: string } }>,
		res: FastifyReply,
	) => {
		const { userID, fileName, contentType } = req.body;

		const newFileName = `${uuidv4()}-${fileName}`;

		const command = new PutObjectCommand({
			Bucket: 'io.idntty.cdn',
			Key: newFileName,
			ContentType: contentType,
		});

		try {
			const url = await getSignedUrl(s3Client, command, {
				expiresIn: 3600,
			});
			await saveBadgeImage({ publicKey: userID, fileKey: newFileName });
			return res.send({ url, newFileName });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ error: `Error generating a presigned URL: ${error}` });
		}
	};

export const getUploadedImages =
	() =>
	async (
		req: FastifyRequest<{
			Querystring: { userID: string };
		}>,
		res: FastifyReply,
	) => {
		const { userID } = req.query;

		if (!userID) {
			return res.status(400).send({ error: 'User ID not found' });
		}

		try {
			const badges = await getBadgeImagesByPublicKey(userID);

			const urls = await Promise.all(
				badges.map(async badge => {
					const command = new GetObjectCommand({
						Bucket: 'io.idntty.cdn',
						Key: badge.fileKey,
					});

					const url = await getSignedUrl(s3Client, command, {
						expiresIn: 3600,
					});

					return url;
				}),
			);

			return res.send({ urls });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ error: `Error getting images: ${error}` });
		}
	};
