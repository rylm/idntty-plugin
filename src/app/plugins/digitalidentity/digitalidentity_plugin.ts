import { BasePlugin } from 'lisk-sdk';
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Endpoint } from './endpoint';

import * as controllers from './controllers';

const server: FastifyInstance = Fastify({});

const opts: RouteShorthandOptions = {
	schema: {
		response: {
			200: {
				type: 'object',
				properties: {
					pong: {
						type: 'string',
					},
				},
			},
		},
	},
};

export class DigitalidentityPlugin extends BasePlugin {
	public endpoint = new Endpoint();

	public get nodeModulePath(): string {
		return __filename;
	}

	public async load(): Promise<void> {
		this.endpoint.init();
		server.get('/ping', opts, controllers.auth.signup());
		server.get('/pong', opts, controllers.auth.signin(this.apiClient));
		server.listen({ port: 8000 });
		console.log('DI:Loaded');
	}

	public async unload(): Promise<void> {}
}
