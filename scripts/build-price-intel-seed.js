/**
 * Build script: generate scripts/price-intel-seed.json from the TS sources
 * (constants.ts + seed-data.ts) so the seed script can run without ts-node.
 *
 * Usage:
 *   node scripts/build-price-intel-seed.js
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs")
const path = require("node:path")

const CONSTANTS_PATH = path.join(__dirname, "..", "src", "lib", "price-intel", "constants.ts")
const SEED_PATH = path.join(__dirname, "..", "src", "lib", "price-intel", "seed-data.ts")
const OUT_PATH = path.join(__dirname, "price-intel-seed.json")

function readArrayLiteral(source, marker) {
  const idx = source.indexOf(marker)
  if (idx === -1) throw new Error("Marker not found: " + marker)
  // Skip past the `=` sign to the value assignment
  const eqIdx = source.indexOf("=", idx)
  if (eqIdx === -1) throw new Error("= not found after " + marker)
  const start = source.indexOf("[", eqIdx)
  if (start === -1) throw new Error("Array start not found after " + marker)
  let depth = 0
  let inString = false
  let stringChar = ""
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    const prev = source[i - 1]
    if (inString) {
      if (ch === stringChar && prev !== "\\") inString = false
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true
      stringChar = ch
      continue
    }
    if (ch === "[") depth++
    else if (ch === "]") {
      depth--
      if (depth === 0) return source.slice(start, i + 1)
    }
  }
  throw new Error("Array end not found")
}

function tsToJson(literal) {
  // Strip trailing commas in arrays / objects (legal in TS, illegal in JSON)
  let s = literal
  // Strip block comments
  s = s.replace(/\/\*[\s\S]*?\*\//g, "")
  // Strip line comments — but NOT inside strings. We do a simple line-wise
  // strip after splitting; OK because our seed literals don't contain `//`
  // inside double-quoted strings.
  s = s
    .split("\n")
    .map((line) => {
      let inStr = false
      let strCh = ""
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        const prev = i > 0 ? line[i - 1] : ""
        if (inStr) {
          if (ch === strCh && prev !== "\\") inStr = false
          continue
        }
        if (ch === '"' || ch === "'" || ch === "`") {
          inStr = true
          strCh = ch
          continue
        }
        if (ch === "/" && line[i + 1] === "/") return line.slice(0, i)
      }
      return line
    })
    .join("\n")
  // Strip `as const` and `satisfies …`
  s = s.replace(/\sas\s+const\b/g, "")
  // Quote unquoted object keys: { foo: ... } → { "foo": ... }
  // Only target keys that follow {, [, or ,
  s = s.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
  // Strip trailing commas
  s = s.replace(/,(\s*[}\]])/g, "$1")
  return s
}

const constantsSrc = fs.readFileSync(CONSTANTS_PATH, "utf8")
const seedSrc = fs.readFileSync(SEED_PATH, "utf8")

const regionsLit = tsToJson(readArrayLiteral(constantsSrc, "export const REGIONS"))
const categoriesLit = tsToJson(readArrayLiteral(constantsSrc, "export const MATERIAL_CATEGORIES"))
const materialsLit = tsToJson(readArrayLiteral(seedSrc, "export const SEED_MATERIALS"))

// CostBenchmarks needs special handling — it's an object literal not array
const benchMarker = "export const COST_BENCHMARKS_USD_PER_SQM"
const benchIdx = constantsSrc.indexOf(benchMarker)
if (benchIdx === -1) throw new Error("Benchmarks marker missing")
const benchStart = constantsSrc.indexOf("{", benchIdx)
let depth = 0
let benchEnd = -1
for (let i = benchStart; i < constantsSrc.length; i++) {
  if (constantsSrc[i] === "{") depth++
  else if (constantsSrc[i] === "}") {
    depth--
    if (depth === 0) { benchEnd = i + 1; break }
  }
}
if (benchEnd === -1) throw new Error("Benchmarks end missing")
const benchObjLit = tsToJson(constantsSrc.slice(benchStart, benchEnd))

const regions = JSON.parse(regionsLit)
const categories = JSON.parse(categoriesLit)
const materials = JSON.parse(materialsLit)
const costBenchmarks = JSON.parse(benchObjLit)

const out = { regions, categories, materials, costBenchmarks }
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2))
console.log("Wrote " + OUT_PATH)
console.log(`  regions=${regions.length} categories=${categories.length} materials=${materials.length} benchmarkRegions=${Object.keys(costBenchmarks).length}`)
