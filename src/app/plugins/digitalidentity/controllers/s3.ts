import type { FastifyRequest, FastifyReply } from 'fastify';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'eu-west-1' });

export const getUploadUrl =
	() =>
	async (
		req: FastifyRequest<{ Body: { fileName: string; contentType: string } }>,
		res: FastifyReply,
	) => {
		const { fileName, contentType } = req.body;

		const command = new PutObjectCommand({
			Bucket: 'io.idntty.images',
			Key: fileName,
			ContentType: contentType,
		});

		try {
			const url = await getSignedUrl(s3Client, command, {
				expiresIn: 3600,
			});
			return res.send({ url });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ error: `Error generating a presigned URL: ${error}` });
		}
	};
