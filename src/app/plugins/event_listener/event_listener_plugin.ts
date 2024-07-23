import { BasePlugin } from 'lisk-sdk';

 /* eslint-disable class-methods-use-this */
 /* eslint-disable  @typescript-eslint/no-empty-function */
 export class EventListenerPlugin extends BasePlugin {

	public name: 'eventListener';

	public get nodeModulePath(): string {
		return  __filename;
	}

	public async load(): Promise<void> {}

	public async unload(): Promise<void> {}
}
