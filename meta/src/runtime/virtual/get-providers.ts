// @ts-expect-error:  Expected, the virtaul file system is only available in the runtime
import { handlers as providers } from "#eliza-virtual/characters";
import type { Provider } from "@ai16z/eliza";
import type { ScannedHandler } from "../../types";

export const getProviders = () => providers as Array<ScannedHandler<Provider>>;
