import type { Nitro } from "nitropack";
import { fileURLToPath } from "node:url";
import { createGenericRollupPlugin } from "../rollup/create-rollup-plugin";
import { scan } from "./scan";

const features = ["actions", "characters", "evaluators", "providers"];

const makeFeature = (name: string) => {
    return {
        name,
        folder: name,
    };
};

export default {
    name: "eliza-meta-framework",
    async setup(nitro: Nitro) {
        const resolve = (path: string) =>
            fileURLToPath(new URL(path, import.meta.url));

        // Scan the features and add them to the nitro instance
        for (const feature of features) {
            const featureConfig = makeFeature(feature);
            const scannedFeatures = await scan({
                nitro,
                feature: featureConfig,
            });
            Object.assign(nitro, scannedFeatures);
        }

        // Register Eliza runtime plugin
        // This does not execute the plugin, it just registers it to be run on runtime startup
        // nitro.options.plugins.push(
        //     resolve("../runtime/plugins/action-plugin.ts")
        // );
        nitro.options.plugins.push(
            resolve("../runtime/plugins/agent-plugin.ts")
        );

        // Add rollup plugins to virtualize userland code for the runtime
        // For debugging go to http://localhost:3000/_vfs to see the virtual file system
        // Use the util in ./virtual.ts if the generic doesn't fit your needs
        nitro.hooks.hook("rollup:before", async (nit, config) => {
            const rollupPlugin = createGenericRollupPlugin("eliza", features);

            // @ts-expect-error - this actually exists it's just not typed
            config.plugins.push(rollupPlugin(nitro));
        });

        nitro.logger.success("Eliza core ready");
    },
};
