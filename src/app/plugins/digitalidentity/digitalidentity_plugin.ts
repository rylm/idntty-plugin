import { BasePlugin } from 'lisk-sdk';

import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';

import { Endpoint } from './endpoint';
import * as controllers from './controllers';

declare module 'fastify' {
	interface Session {
		currentChallenge: string | undefined;
		publicKey: string | undefined;
		username: string | undefined;
	}
}

const server = Fastify({ logger: true });
server.register(fastifyCors, {
	origin: true,
	credentials: true,
});
server.register(fastifyCookie);
server.register(fastifySession, {
	secret: process.env.SESSION_SECRET ?? '',
	cookie: {
		sameSite: 'none',
	},
});

export class DigitalidentityPlugin extends BasePlugin {
	public endpoint = new Endpoint();

	public get nodeModulePath(): string {
		return __filename;
	}

	public async load(): Promise<void> {
		this.endpoint.init();

		server.get('/register', controllers.auth.register());
		server.post('/register/verify', controllers.auth.registerVerify());
		server.get('/login', controllers.auth.login());
		server.post('/login/verify', controllers.auth.loginVerify());
		server.post('/message/send', controllers.data.messageSend());
		server.get('/message/get', controllers.data.messageGet());

		server.listen({ port: 8000 });
		console.log('DI:Loaded');
	}

	public async unload(): Promise<void> {}
}
