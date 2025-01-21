/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'klayr-sdk';
import { DashboardPlugin } from '@klayr/dashboard-plugin';

import { DigitalidentityPlugin } from './plugins/digitalidentity';
import { EventListenerPlugin } from './plugins/event_listener/event_listener_plugin';

export const registerPlugins = (app: Application): void => {
    console.log('!!!plugins');
    app.registerPlugin(new DashboardPlugin());

    app.registerPlugin(new DigitalidentityPlugin());
    app.registerPlugin(new EventListenerPlugin());
};
