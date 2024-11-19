import { virtual } from "./virtual";
import { fileURLToPath } from "node:url";
import type { Nitro } from "nitropack/types";
import { hash } from "ohash";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const runtimeDir = fileURLToPath(
    new URL("dist/runtime/", import.meta.url)
);

interface HandlerDefinition {
    type: string;
    handler: string;
    route?: string;
    options?: any;
    lazy?: boolean;
}

export function getImportId(p: string, lazy?: boolean): string {
    return (lazy ? "_lazy_" : "_") + hash(p).slice(0, 6);
}

/**
 * Creates a Generic Rollup plugin for the given module name and features.
 * If this doesnt't fit your needs, you can create a custom Rollup plugin using the util from ./virtual.ts
 */
export function createGenericRollupPlugin(
    moduleName: string,
    features: string[]
) {
    return function (nitro: Nitro) {
        const getHandlers = (): HandlerDefinition[] => {
            return features.flatMap((feature) => {
                const key = `scanned${capitalize(feature)}`;
                const scannedHandlers = (nitro as any)[key] || [];
                return scannedHandlers.map((h: any) => ({
                    ...h,
                    type: feature,
                }));
            });
        };

        const generateHandlerCode = (
            handlers: HandlerDefinition[],
            type: string
        ): string => {
            const typeHandlers = handlers.filter((h) => h.type === type);
            const imports = typeHandlers
                .filter((h) => !h.lazy)
                .map((h) => h.handler);
            const lazyImports = typeHandlers
                .filter((h) => h.lazy)
                .map((h) => h.handler);

            return `
${imports
    .map((handler) => `import ${getImportId(handler)} from '${handler}';`)
    .join("\n")}
${lazyImports
    .map(
        (handler) =>
            `const ${getImportId(handler, true)} = () => import('${handler}');`
    )
    .join("\n")}
export const handlers = [
${typeHandlers
    .map((h) => {
        const handlerId = getImportId(h.handler, h.lazy);
        return `{type: ${JSON.stringify(h.type)}, handler: ${handlerId}, lazy: ${
            h.lazy
        }, route: ${JSON.stringify(h.route)}, options: ${JSON.stringify(
            h.options
        )}}`;
    })
    .join(",\n")}
];
`.trim();
        };

        const virtualFiles: Record<string, () => string> = {};
        for (const feature of features) {
            virtualFiles[`#${moduleName.toLowerCase()}-virtual/${feature}`] =
                () => generateHandlerCode(getHandlers(), feature);
        }

        return virtual(virtualFiles, nitro.vfs);
    };
}

export function pushPlugin(nitro: Nitro, pluginPath: string): void {
    nitro.options.plugins.push(pluginPath);
}
