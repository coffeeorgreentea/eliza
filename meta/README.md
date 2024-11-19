# experimental meta-framework

This is not ready for production use.

This builds ontop of the current Eliza framework, fleshing out the framework and development experience.

## File Based Organization

This makes the framework easier to adopt for newcomers or anyone who has used something like Next.js.

After you create a project with `create-eliza-app`, you will have the following file structure:

```
src/
    actions/
        do-something.ts
    characters/
        static-character.json
        dynamic-character.ts
    evaluators/
        evaluate-something.ts
    providers/
        provide-something.ts
  eliza.config.ts
  package.json
  tsconfig.json
```

Your actions/characters/evaluators/providers are all scanned, virtualized and injected into your Eliza app.

## Create Eliza App:

NOTE: This is not published yet. You can build it locally.

<!-- automd:pm-x version="latest" name="create-eliza-app" args="path" <flags>" -->

```sh
# npm
npx create-eliza-app@latest path

# pnpm
pnpm dlx create-eliza-app@latest path

# bun
bunx create-eliza-app@latest path

# deno
deno run -A npm:create-eliza-app@latest path
```

<!-- /automd -->

## Eliza Template Registry

You can pass a template flag to create-eliza-app when creating you Eliza app.

```sh
npx create-eliza-app@latest path --template <template>
```

You can check out the available templates here [./templates](./templates)

You can bring your own template registry by passing a registry flag to create-eliza-app.

```sh
npx create-eliza-app@latest path --registry <registry>
```

## Eliza CLI

The eliza CLI is your home base for developing with Eliza.
Commands:

-   `eliza prepare` - Prepare the project
-   `eliza dev` - Start the development server
-   `eliza build` - Build the project
-   `eliza preview` - Preview the project

## Eliza Config

The `eliza.config.ts` file is the main configuration file, allowing advanced config via `c12`.

```ts
import { defineElizaConfig } from "eliza";

export default defineElizaConfig({
    // ...
});
```

## Eliza Hooks

...

## Eliza Devtools

When you run `eliza dev` you will have access to the Eliza Devtools.

The core Eliza Devtools are by default located at [http://localhost:3000/\_eliza](http://localhost:3000/_eliza).
You can also view the virtual file system at [http://localhost:3000/\_vfs](http://localhost:3000/_vfs).

## Runtime Agnostic

We should be able to support additional runtimes with this setup. [see this](https://nitro.build/deploy)

## Dynamic Characters

Previously characters were mainly static json files. Now you can use code to define your characters.

## Advanced Typescript Support

The `eliza prepare` command, which runs before `eliza dev` and `eliza build`, and watches for changes, generates information from your codebase to provide advanced typescript support.

You can can typed infromation from you characters, plugins, and more.

```ts
import type { Characters } from "@ai16z/eliza-nitro";

type MyCharacter = Characters["MyCharacter"];
```
