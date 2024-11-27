import { Types } from 'klayr-sdk';

export interface ModuleConfig {
    features: object[];
    verifications: object[];
}

export type ModuleConfigJSON = Types.JSONObject<ModuleConfig>;
