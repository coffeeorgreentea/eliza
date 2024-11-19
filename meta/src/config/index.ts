import type { NitroConfig as BaseConfig } from "nitropack/types";

import mod from "../core/eliza-module";
import pkg from "../../package.json";

export interface ElizaConfig extends BaseConfig {
    actionsDir?: string;
    charactersDir?: string;
    evaluatorsDir?: string;
    providersDir?: string;
}

export function defineElizaConfig(config: ElizaConfig): ElizaConfig {
    return {
        buildDir: ".eliza",
        srcDir: "src",
        output: {
            dir: ".out",
        },
        framework: {
            name: "Eliza",
            version: pkg.version,
        },
        ...config,
        modules: [...(config.modules || []), mod],
    };
}
