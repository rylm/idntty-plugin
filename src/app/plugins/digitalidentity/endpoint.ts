import { Plugins } from 'klayr-sdk';

export class Endpoint extends Plugins.BasePluginEndpoint {
    public async test(): Promise<object> {
        return { test: 'done' };
    }

    public init() {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! EEEEEEEEEEEE ');
    }
}
