import { scanServerRoutes } from "./_scan";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export async function scan({
    nitro,
    feature,
}: any): Promise<Record<string, any[]>> {
    const scannedFeatureName = `scanned${capitalize(feature.name)}`;
    console.log(`Scanning routes for ${feature.name}`);
    const routes = await scanServerRoutes(nitro, feature.folder);
    console.log(`Scanned ${routes.length} routes for ${feature.name}`);
    return {
        [scannedFeatureName]: routes,
    };
}
