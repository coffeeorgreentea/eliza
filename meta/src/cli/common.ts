import type { ArgsDef } from "citty";
import { CompatibilityDateSpec } from "compatx";

export const commonArgs = <ArgsDef>{
    dir: {
        type: "string",
        description: "project root directory",
    },
    _dir: {
        type: "positional",
        default: ".",
        description: "project root directory (prefer using `--dir`)",
    },
};

export const configFile = "eliza.config";

export const compatibilityDate = new Date()
    .toISOString()
    .split("T")[0] as CompatibilityDateSpec;
