import { defineBuildConfig } from "unbuild";

const nitroSubpaths = [
    "cli",
    "config",
    "core",
    "kit",
    "presets",
    "rollup",
    "types",
    "meta",
];

const elizaVirtualSubpaths = [
    "actions",
    "characters",
    "evaluators",
    "providers",
];

export default defineBuildConfig({
    externals: [
        "nitropack",
        "nitropack/runtime/meta",
        ...nitroSubpaths.map((subpath) => `nitropack/${subpath}`),
        "citty",
        "listhen/cli",
        "pathe",
        "consola",
        "globby",
        "ufo",
        "ohash",
        "h3",
        "giget",
        ...elizaVirtualSubpaths.map((subpath) => `#eliza-virtual/${subpath}`),
    ],
});
