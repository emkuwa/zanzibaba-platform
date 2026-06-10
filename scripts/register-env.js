const dotenv = require("dotenv")
const path = require("path")

// --require resolves __dirname to the script's directory (scripts/)
// so go up one level to reach platform root
const root = path.resolve(__dirname, "..")
dotenv.config({ path: path.resolve(root, ".env") })
dotenv.config({ path: path.resolve(root, ".env.local") })
