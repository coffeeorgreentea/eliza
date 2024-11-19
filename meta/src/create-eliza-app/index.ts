#!/usr/bin/env node
import { downloadTemplate, registryProvider } from "giget";
import { runMain } from "citty";

const defaultTemplate = "unjs";

const defaultRegistry = registryProvider(
    "https://raw.githubusercontent.com/unjs/giget/main/templates"
);

runMain({
    args: {
        name: {
            type: "string",
            description: "name of the template",
        },
        registry: {
            type: "string",
            description: "registry to download the template from",
        },

        dir: {
            type: "string",
            description: "where to create the project",
        },
        _dir: {
            type: "positional",
            default: ".",
            description: "where to create the project (prefer using `--dir`)",
        },
    },
    async run(context) {
        const res = await downloadTemplate(
            context.args.name || defaultTemplate,
            {
                providers: { default: defaultRegistry },
                dir: context.args.dir,
            }
        );
        console.log(`Downloaded template to ${res.dir} from ${res.source}`);
    },
});
