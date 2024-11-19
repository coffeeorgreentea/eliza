import type { Action, Provider, Character, Evaluator } from "@ai16z/eliza";
import type { Nitro, NitroApp } from "nitropack/types";

export type ScannedHandler<T = any> = {
    type: string;
    handler: () => Promise<T>;
    lazy: boolean;
    route: string;
    options?: any;
};

export type ActionHandler = ScannedHandler<Action>;

export type ProviderHandler = ScannedHandler<Provider>;

export type CharacterHandler = ScannedHandler<Character>;

export type EvaluatorHandler = ScannedHandler<Evaluator>;
