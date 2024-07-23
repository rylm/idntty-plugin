/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { DigitalidentityPlugin } from './plugins/digitalidentity';
import { EventListenerPlugin } from "./plugins/event_listener/event_listener_plugin";

// import { HelloInfoPlugin } from "./plugins/hello_info/hello_info_plugin";

export const registerPlugins = (app: Application): void => {
    console.log('!!!plugins');
    app.registerPlugin(new DigitalidentityPlugin());
    app.registerPlugin(new EventListenerPlugin());
};
