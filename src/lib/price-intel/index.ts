/**
 * Public façade for the Price Intelligence Engine.
 *
 * Re-exports the most commonly used pieces so other parts of the app can
 * `import { ... } from "@/lib/price-intel"` without reaching into internal
 * file names.
 */

export * from "./constants"
export * from "./normalization"
export * from "./index-aggregator"
export * from "./estimator"
export { buildScheduleFromBOQ, buildScheduleFromEstimate } from "./schedule"
export * from "./boq-parser"
export * from "./rfq-generator"
export * from "./procurement"
