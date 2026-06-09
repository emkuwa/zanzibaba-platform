import { generateClaimLinks } from '../src/lib/activation/claim-system.js'

try {
  const result = await generateClaimLinks()
  console.log(JSON.stringify(result, null, 2))
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
