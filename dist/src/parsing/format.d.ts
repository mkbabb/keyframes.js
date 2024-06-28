import { Animation, Vars } from '../animation';

export declare function CSSKeyframesToString<V extends Vars>(animation: Animation<V>, name?: string, printWidth?: number): Promise<string>;
