// @ts-expect-error:  Expected, the virtaul file system is only available in the runtime
import { handlers as evaluators } from "#eliza-virtual/evaluators";
import type { Evaluator } from "@ai16z/eliza";
import type { ScannedHandler } from "../../types";

export const getEvaluators = () =>
    evaluators as Array<ScannedHandler<Evaluator>>;
