import { defineNitroPlugin } from "nitropack/runtime";
import { getTokenForProvider } from "@ai16z/agent";
import { PostgresDatabaseAdapter } from "@ai16z/adapter-postgres";
import { SqliteDatabaseAdapter } from "@ai16z/adapter-sqlite";
import Database from "better-sqlite3";
import {
    Action,
    AgentRuntime,
    defaultCharacter,
    Evaluator,
    Provider,
} from "@ai16z/eliza";
import { Character } from "@ai16z/eliza";
import { bootstrapPlugin } from "@ai16z/plugin-bootstrap";
import nodePlugin from "@ai16z/plugin-node";
import { getActions } from "../virtual/get-actions";
import { getCharacters } from "../virtual/get-characters";
import { getProviders } from "../virtual/get-providers";
import { getEvaluators } from "../virtual/get-evaluators";

function initializeDatabase() {
    if (process.env.POSTGRES_URL) {
        return new PostgresDatabaseAdapter({
            connectionString: process.env.POSTGRES_URL,
        });
    } else {
        return new SqliteDatabaseAdapter(new Database("./db.sqlite"));
    }
}

const resolveActions = async (): Promise<Action[]> => {
    const actions = getActions();
    const resolvedActions = await Promise.all(
        actions.map(async (action) => {
            const handler = await action.handler();
            if ("default" in handler) {
                return handler.default as Action;
            } else {
                console.error(
                    `No default export found for action ${action.route}`
                );
            }
        })
    );

    return resolvedActions.filter(Boolean) as Action[];
};

const resolveCharacters = async (): Promise<Character[]> => {
    const characters = getCharacters();
    const resolvedCharacters = await Promise.all(
        characters.map(async (character) => {
            const handler = await character.handler();
            if ("default" in handler && typeof handler.default === "function") {
                return handler.default() as Character;
                // todo, maybe validate the json?
            } else if (handler) {
                return handler as Character;
            }
        })
    );

    return resolvedCharacters.filter(Boolean) as Character[];
};

const resolveProviders = async (): Promise<Provider[]> => {
    const providers = getProviders();
    const resolvedProviders = await Promise.all(
        providers.map(async (provider) => {
            const handler = await provider.handler();
            if ("default" in handler) {
                return handler.default as Provider;
            } else if (handler) {
                return handler as Provider;
            }
        })
    );

    return resolvedProviders.filter(Boolean) as Provider[];
};

const resolveEvaluators = async (): Promise<any[]> => {
    const evaluators = getEvaluators();
    const resolvedEvaluators = await Promise.all(
        evaluators.map(async (evaluator) => {
            const handler = await evaluator.handler();
            if ("default" in handler) {
                return handler.default as Evaluator;
            } else if (handler) {
                return handler;
            }
        })
    );

    return resolvedEvaluators.filter(Boolean);
};

export async function createAgent(
    character: Character,
    db: any,
    token: string,
    {
        actions,
        providers,
        evaluators,
    }: {
        actions: Action[];
        providers: Provider[];
        evaluators: any[];
    }
) {
    return new AgentRuntime({
        databaseAdapter: db,
        token,
        modelProvider: character.modelProvider,
        evaluators,
        character,
        plugins: [bootstrapPlugin, nodePlugin].filter(Boolean),
        providers,
        actions,
        services: [],
        managers: [],
    });
}

declare module "nitropack/types" {
    interface NitroApp {
        agent: AgentRuntime;
    }
}

export default defineNitroPlugin(async (nitroApp) => {
    const actions = await resolveActions();
    const characters = await resolveCharacters();
    const providers = await resolveProviders();
    const evaluators = await resolveEvaluators();

    const token = getTokenForProvider(
        characters.length > 0
            ? characters[0].modelProvider
            : defaultCharacter.modelProvider,
        characters.length > 0 ? characters[0] : defaultCharacter
    );
    const db = initializeDatabase();

    console.log(evaluators);

    nitroApp["agent"] = await createAgent(
        characters.length > 0 ? characters[0] : defaultCharacter,
        db,
        token || "",
        {
            actions,
            providers,
            evaluators,
        }
    );

    console.log("Agent started");
});
