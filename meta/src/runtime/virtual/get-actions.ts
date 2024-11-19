// @ts-expect-error:  Expected, the virtaul file system is only available in the runtime
import { handlers as actions } from "#eliza-virtual/actions";
import type { Action } from "@ai16z/eliza";
import type { ScannedHandler } from "../../types";

export const getActions = () => actions as Array<ScannedHandler<Action>>;
