/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'klayr-sdk';
import { DashboardPlugin } from '@klayr/dashboard-plugin';

export const registerPlugins = (app: Application): void => {
    console.log('!!!plugins');
    app.registerPlugin(new DashboardPlugin());
};
