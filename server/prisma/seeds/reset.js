const reset = async prisma => {
  await prisma.inspectionQualitativeFault.deleteMany({ where: { inspectionId: { not: -1 }}})
  await prisma.inspectionQuantitativeFault.deleteMany({ where: { inspectionId: { not: -1 }}})
  await prisma.inspection.deleteMany({ where: { id: { not: -1 }}})
  await prisma.car.deleteMany({ where: { id: { not: -1 }}})
  await prisma.model.deleteMany({ where: { id: { not: -1 }}})
  await prisma.make.deleteMany({ where: { id: { not: -1 }}})
  await prisma.station.deleteMany({ where: { id: { not: -1 }}})
  await prisma.qualitativeFault.deleteMany({ where: { id: { not: -1 }}})
  await prisma.quantitativeFault.deleteMany({ where: { id: { not: -1 }}})
  await prisma.engineType.deleteMany({ where: { id: { not: -1 }}})
  await prisma.bodyType.deleteMany({ where: { id: { not: -1 }}})
}

export default reset
