import { jwtVerify } from 'jose';
import * as _sodium from 'libsodium-wrappers-sumo';
import { createPrivateKey, createPublicKey, type KeyObject } from 'crypto';

import { v4 } from 'uuid';
import type { v4String } from '../types/uuid';

export const uuidv4 = v4 as v4String;

export async function toPrivateKeyObject(rawPrivateKey: Buffer) {
    await _sodium.ready;
    const sodium = _sodium;

    return createPrivateKey({
        key: `-----BEGIN PRIVATE KEY-----\n${sodium.to_base64(
            Buffer.concat([
                Buffer.from('302e020100300506032b657004220420', 'hex'),
                rawPrivateKey.subarray(0, 32),
            ]),
            sodium.base64_variants.ORIGINAL,
        )}\n-----END PRIVATE KEY-----`,
        format: 'pem',
    });
}

export async function toPublicKeyObject(rawPublicKey: Buffer) {
    await _sodium.ready;
    const sodium = _sodium;

    return createPublicKey({
        key: `-----BEGIN PUBLIC KEY-----\n${sodium.to_base64(
            Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), rawPublicKey]),
            sodium.base64_variants.ORIGINAL,
        )}\n-----END PUBLIC KEY-----`,
        format: 'pem',
    });
}

export async function verifyJWT(jwt: string, publicKey: KeyObject, rawPublicKey: string) {
    return jwtVerify(jwt, publicKey, {
        issuer: rawPublicKey,
    });
}
