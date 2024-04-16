import { PrismaClient } from '@prisma/client';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/typescript-types';

const prisma = new PrismaClient();

export const getUserWithDevicesByPublicKey = async (publicKey: string) =>
	prisma.user.findUnique({
		where: {
			public_key: publicKey,
		},
		include: {
			devices: {
				include: {
					transports: true,
				},
			},
		},
	});

export const getUserByPublicKey = async (publicKey: string) =>
	prisma.user.findUnique({
		where: {
			public_key: publicKey,
		},
	});

export const getAuthenticatorDeviceByCredentialID = async (credentialID: Uint8Array) =>
	prisma.authenticatorDevice.findFirst({
		where: {
			credential_id: Buffer.from(credentialID),
		},
		include: {
			transports: true,
		},
	});

export const createUser = async ({
	publicKey,
	username,
	credentialID,
	credentialPublicKey,
	counter,
	transports,
}: {
	publicKey: string;
	username: string;
	credentialID: Uint8Array;
	credentialPublicKey: Uint8Array;
	counter: number;
	transports: AuthenticatorTransportFuture[];
}) =>
	prisma.user.create({
		data: {
			public_key: publicKey,
			username,
			devices: {
				create: [
					{
						credential_id: Buffer.from(credentialID),
						credential_public_key: Buffer.from(credentialPublicKey),
						counter,
						transports: {
							create: transports.map(transport => ({
								transport: transport === 'smart-card' ? 'smart_card' : transport,
							})),
						},
					},
				],
			},
		},
	});

export const createAuthenticatorDevice = async ({
	userID,
	credentialID,
	credentialPublicKey,
	counter,
	transports,
}: {
	userID: string;
	credentialID: Uint8Array;
	credentialPublicKey: Uint8Array;
	counter: number;
	transports: AuthenticatorTransportFuture[];
}) =>
	prisma.authenticatorDevice.create({
		data: {
			user_id: userID,
			credential_id: Buffer.from(credentialID),
			credential_public_key: Buffer.from(credentialPublicKey),
			counter,
			transports: {
				create: transports.map(transport => ({
					transport: transport === 'smart-card' ? 'smart_card' : transport,
				})),
			},
		},
	});

export const updateAuthenticatorDevice = async ({
	credentialID,
	counter,
}: {
	credentialID: Buffer;
	counter: number;
}) =>
	prisma.authenticatorDevice.update({
		where: {
			credential_id: credentialID,
		},
		data: {
			counter,
		},
	});

export const saveEncryptedData = async ({
	publicKey,
	encryptedData,
	nonce,
}: {
	publicKey: string;
	encryptedData: string;
	nonce: string;
}) =>
	prisma.encryptedMessage.create({
		data: {
			user_id: publicKey,
			message: encryptedData,
			nonce,
		},
	});

export const getEncryptedData = async (publicKey: string) =>
	prisma.encryptedMessage.findFirst({
		where: {
			user_id: publicKey,
		},
	});

export const saveBadgeImage = async ({
	publicKey,
	fileKey,
}: {
	publicKey: string;
	fileKey: string;
}) =>
	prisma.badge.create({
		data: {
			user_id: publicKey,
			fileKey,
		},
	});

export const getBadgeImagesByPublicKey = async (publicKey: string) =>
	prisma.badge.findMany({
		where: {
			user_id: publicKey,
		},
	});
