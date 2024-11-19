// @ts-expect-error:  Expected, the virtaul file system is only available in the runtime
import { handlers as characters } from "#eliza-virtual/characters";
import type { Character } from "@ai16z/eliza";
import type { ScannedHandler } from "../../types";

export const getCharacters = () =>
    characters as Array<ScannedHandler<Character>>;
