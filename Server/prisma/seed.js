import "dotenv/config";
// import { PrismaClient } from "../generated/prisma/index.js";
// import { PrismaPg } from "@prisma/adapter-pg";
import { prisma } from "../src/db.js";

import trailSeed from "./trails.json" with { type: "json" };

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });

// const prisma = new PrismaClient({
//   adapter,
// });

await prisma.trail.createMany({
  data: trailSeed,
});
