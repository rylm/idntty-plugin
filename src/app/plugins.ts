/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { DigitalidentityPlugin } from './plugins/digitalidentity';
// import { HelloInfoPlugin } from "./plugins/hello_info/hello_info_plugin";

export const registerPlugins = (app: Application): void => {
	console.log('!!!plugins');
	app.registerPlugin(new DigitalidentityPlugin());
};
