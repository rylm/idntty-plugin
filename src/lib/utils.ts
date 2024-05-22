import { jwtVerify } from 'jose';

import { v4 } from 'uuid';
import type { v4String } from '../types/uuid';

export const uuidv4 = v4 as v4String;

export async function verifyJWT(jwt: string, publicKey: string) {
	return jwtVerify(jwt, Buffer.from(publicKey, 'hex'), {
		issuer: publicKey,
	});
}
