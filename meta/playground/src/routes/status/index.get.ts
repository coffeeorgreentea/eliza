import { useNitroApp, defineEventHandler } from "#imports";
import { AgentRuntime } from "@ai16z/eliza";

declare module "nitropack/types" {
    interface NitroApp {
        agent: AgentRuntime;
    }
}
export default defineEventHandler((event) => {
    const nitro = useNitroApp();
    const status =
        "agent" in nitro
            ? {
                  id: nitro.agent.agentId,
                  character: nitro.agent.character.name,
                  modelProvider: nitro.agent.modelProvider,
                  actions: nitro.agent.actions.map((a) => a.name),
                  evaluators: nitro.agent.evaluators.map((e) => e.name),
              }
            : { status: "no-agent" };
    return `
<!doctype html>
<html class="bg-black">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
    </head>

    <body class="h-dvh w-full flex flex-col items-center justify-center text-white font-sans">
    <main class="flex flex-col items-center justify-center">
        <h1 class="text-4xl">Agent Status</h1>
        <pre>${JSON.stringify(status, null, 2)}</pre>
    </main>
    </body>
</html>
    `;
});
