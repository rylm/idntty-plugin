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

export const saveUserDataEntry = async ({
	publicKey,
	domains,
	data,
}: {
	publicKey: string;
	domains: Uint8Array[];
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
			console.log('Trying to save data for domain', { domain: Buffer.from(domain) });
			const existingEntry = await prisma.userDataEntry.findFirst({
				where: {
					user_id: publicKey,
					domain: Buffer.from(domain),
				},
			});

			console.log('Existing data entry:', existingEntry);

			if (existingEntry) {
				await Promise.all(
					data.map(async item => {
						const existingDataItem = await prisma.dataItem.findFirst({
							where: {
								userDataEntryId: existingEntry.id,
								uuid: item.uuid,
							},
						});

						if (existingDataItem) {
							await prisma.dataItem.update({
								where: {
									id: existingDataItem.id,
								},
								data: {
									value: Buffer.from(item.value),
									nonce: Buffer.from(item.nonce),
								},
							});
						} else {
							await prisma.dataItem.create({
								data: {
									userDataEntryId: existingEntry.id,
									uuid: item.uuid,
									value: Buffer.from(item.value),
									nonce: Buffer.from(item.nonce),
								},
							});
						}
					}),
				);
			} else {
				console.log('Creating a new data entry');
				const newEntry = await prisma.userDataEntry.create({
					data: {
						user_id: publicKey,
						domain: Buffer.from(domain),
					},
				});

				console.log('New entry:', newEntry);

				await Promise.all(
					data.map(async item =>
						prisma.dataItem.create({
							data: {
								userDataEntryId: newEntry.id,
								uuid: item.uuid,
								value: Buffer.from(item.value),
								nonce: Buffer.from(item.nonce),
							},
						}),
					),
				);
			}
		}),
	);
};

export const getPrivateUserDataEntry = async (publicKey: string) => {
	const entry = await prisma.userDataEntry.findFirst({
		where: {
			user_id: publicKey,
			domain: Buffer.from([0x0]),
		},
		include: {
			dataItems: true,
		},
	});

	return entry?.dataItems
		? entry.dataItems.map(
				item => ({ uuid: item.uuid, value: item.value, nonce: item.nonce } as DataEntry),
		  )
		: [];
};

export const getPublicUserDataEntry = async (publicKey: string) => {
	const entry = await prisma.userDataEntry.findFirst({
		where: {
			user_id: publicKey,
			domain: Buffer.from([0x1]),
		},
		include: {
			dataItems: true,
		},
	});

	return entry?.dataItems
		? entry.dataItems.map(
				item => ({ uuid: item.uuid, value: item.value, nonce: item.nonce } as DataEntry),
		  )
		: [];
};

export const getSharedUserDataEntry = async (publicKey: string, forPublicKey: string) => {
	const entries = await prisma.userDataEntry.findMany({
		where: {
			user_id: publicKey,
			domain: Buffer.from(forPublicKey, 'hex'),
		},
		include: {
			dataItems: true,
		},
	});

	return entries.reduce<DataEntry[]>((acc, entry) => {
		const dataEntries = entry.dataItems.map(
			item =>
				({
					uuid: item.uuid,
					value: item.value,
					nonce: item.nonce,
				} as DataEntry),
		);
		return acc.concat(dataEntries);
	}, []);
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
