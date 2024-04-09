import { BasePlugin } from 'lisk-sdk';

export const signup = () => async (): Promise<object> => ({ pong: 'it worked!' });

export const signin = (apiClient: BasePlugin['apiClient']) => async (): Promise<object> => {
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	const a = await apiClient.invoke('digitalidentity_test');
	console.log(a);

	return { pong: 'done' };
};
