import Prisma from "@prisma/client";
import seed from './seeds/seed.js'

const { PrismaClient } = Prisma
const prisma = new PrismaClient()
await seed(prisma)

export default prisma
