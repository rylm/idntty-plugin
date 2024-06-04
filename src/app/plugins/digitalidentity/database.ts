import { PrismaClient } from '@prisma/client';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/typescript-types';
import type { DataEntry } from './controllers/data';

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
	layout,
}: {
	publicKey: string;
	username: string;
	credentialID: Uint8Array;
	credentialPublicKey: Uint8Array;
	counter: number;
	transports: AuthenticatorTransportFuture[];
	layout: object;
}) =>
	prisma.user.create({
		data: {
			public_key: publicKey,
			username,
			layout: JSON.stringify(layout),
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
	publicKey,
	credentialID,
	credentialPublicKey,
	counter,
	transports,
}: {
	publicKey: string;
	credentialID: Uint8Array;
	credentialPublicKey: Uint8Array;
	counter: number;
	transports: AuthenticatorTransportFuture[];
}) =>
	prisma.authenticatorDevice.create({
		data: {
			public_key: publicKey,
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

export const getUserLayout = async (publicKey: string) => {
	const user = await prisma.user.findUnique({
		where: {
			public_key: publicKey,
		},
		select: {
			layout: true,
		},
	});

	if (!user) {
		throw new Error('User not found');
	}

	return JSON.parse(user.layout as string) as object;
};

export const updateUserLayout = async ({
	publicKey,
	layout,
}: {
	publicKey: string;
	layout: object;
}) =>
	prisma.user.update({
		where: {
			public_key: publicKey,
		},
		data: {
			layout: JSON.stringify(layout),
		},
	});

export const saveUserChallenge = async (publicKey: string, challenge: string | null) =>
	prisma.userChallenge.upsert({
		where: {
			public_key: publicKey,
		},
		create: {
			public_key: publicKey,
			challenge,
		},
		update: {
			challenge,
		},
	});

export const getUserChallenge = async (publicKey: string) => {
	const user = await prisma.userChallenge.findUnique({
		where: {
			public_key: publicKey,
		},
	});

	if (!user) {
		throw new Error('Challenge not found');
	}

	return user.challenge;
};

export const saveUserDataEntry = async ({
	publicKey,
	domains,
	data,
}: {
	publicKey: string;
	domains: string[];
	data: DataEntry[];
}) => {
	console.log('Trying to save user data entry', { publicKey, domains, data });

	const userExists = await prisma.user.findUnique({
		where: { public_key: publicKey },
	});

	if (!userExists) {
		throw new Error('User does not exist with the provided public key');
	}

	await Promise.all(
		domains.map(async domain => {
			await Promise.all(
				data.map(async item => {
					console.log('Trying to save data item', {
						uuid: item.uuid,
						value: item.value,
						nonce: item.nonce,
					});
					const existingEntry = await prisma.userData.findFirst({
						where: {
							public_key: publicKey,
							domain,
							label: item.uuid,
						},
					});

					console.log('Existing entry', existingEntry);

					if (existingEntry) {
						await prisma.userData.update({
							where: {
								id: existingEntry.id,
							},
							data: {
								value: item.value,
								nonce: item.nonce,
							},
						});
					} else {
						console.log('Creating new entry');
						await prisma.userData.create({
							data: {
								public_key: publicKey,
								domain,
								label: item.uuid,
								value: item.value,
								nonce: item.nonce,
							},
						});
					}
				}),
			);
		}),
	);
};

export const getPrivateUserDataEntry = async (publicKey: string) => {
	const entries = await prisma.userData.findMany({
		where: {
			public_key: publicKey,
			domain: publicKey,
		},
	});

	return entries.map(
		entry =>
			({
				uuid: entry.label,
				value: entry.value,
				nonce: entry.nonce,
			} as DataEntry),
	);
};

export const getPublicUserDataEntry = async (publicKey: string) => {
	const entries = await prisma.userData.findMany({
		where: {
			public_key: publicKey,
			domain: '',
		},
	});

	return entries.map(
		entry =>
			({
				uuid: entry.label,
				value: entry.value,
				nonce: entry.nonce,
			} as DataEntry),
	);
};

export const getSharedUserDataEntry = async (publicKey: string, forPublicKey: string) => {
	const entries = await prisma.userData.findMany({
		where: {
			public_key: publicKey,
			domain: forPublicKey,
		},
	});

	return entries.map(
		entry =>
			({
				uuid: entry.label,
				value: entry.value,
				nonce: entry.nonce,
			} as DataEntry),
	);
};

export const saveBadgeImage = async ({
	publicKey,
	fileKey,
}: {
	publicKey: string;
	fileKey: string;
}) =>
	prisma.badge.create({
		data: {
			public_key: publicKey,
			fileKey,
		},
	});

export const getBadgeImagesByPublicKey = async (publicKey: string) =>
	prisma.badge.findMany({
		where: {
			public_key: publicKey,
		},
	});
