const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const r = await p.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY 1;");
  console.log("Tables (" + r.length + "):");
  for (const x of r) console.log("  " + x.table_name);
  await p.$disconnect();
})();
