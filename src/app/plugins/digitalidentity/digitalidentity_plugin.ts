/* eslint-disable @typescript-eslint/no-misused-promises */

import { BasePlugin } from 'lisk-sdk';

import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';

import { Endpoint } from './endpoint';
import * as controllers from './controllers';

const server = Fastify({ logger: true });
server.register(fastifyCors, {
    origin: true,
    credentials: true,
});

export class DigitalidentityPlugin extends BasePlugin {
    public endpoint = new Endpoint();

    public get nodeModulePath(): string {
        return __filename;
    }

    public async load(): Promise<void> {
        this.endpoint.init();

        server.get('/node/info', controllers.node.info(this.apiClient));
        server.get('/node/metrics', controllers.node.metrics(this.apiClient));
        server.get('/node/schema', controllers.node.schema(this.apiClient));
        server.get('/node/metadata', controllers.node.metadata(this.apiClient));

        server.get('/account', controllers.account.get(this.apiClient));

        server.get('/register', controllers.auth.register());
        server.post('/register/verify', controllers.auth.registerVerify());

        server.get('/login', controllers.auth.login());
        server.post('/login/verify', controllers.auth.loginVerify());

        server.get('/layout', controllers.data.getLayout());
        server.post(
            '/layout/update',
            { preHandler: controllers.auth.jwtVerificationPreHandler() },
            controllers.data.updateLayout(),
        );

        server.get(
            '/data/private',
            {
                preHandler: controllers.auth.jwtVerificationPreHandler(),
            },
            controllers.data.getPrivateData(),
        );
        server.get('/data/public', controllers.data.getPublicData());
        server.get(
            '/data/shared',
            {
                preHandler: controllers.auth.jwtVerificationPreHandler(),
            },
            controllers.data.getSharedData(),
        );
        server.post(
            '/data/save',
            {
                preHandler: controllers.auth.jwtVerificationPreHandler(),
            },
            controllers.data.saveData(),
        );

        server.get('/get-user-idntty', controllers.data.getUserIdentity());

        server.post(
            '/get-upload-url',
            {
                preHandler: controllers.auth.jwtVerificationPreHandler(),
            },
            controllers.s3.getUploadUrl(),
        );
        server.get('/get-uploaded-images', controllers.s3.getUploadedImages());

        server.get('/get-notifications', controllers.events.getNotifications());

        server.listen({ port: 8000 });
        console.log('DI:Loaded');
    }

    public async unload(): Promise<void> {}
}
