import { JSONObject } from 'lisk-sdk';

export interface ModuleConfig {
    features: object[];
    verifications: object[];
}

export type ModuleConfigJSON = JSONObject<ModuleConfig>;
