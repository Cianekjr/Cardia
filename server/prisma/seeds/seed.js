import faker from 'faker'
import Prisma from "@prisma/client";
import bcrypt from "bcrypt";
import { getRandomArg, getRandomInt, getMixString } from './helpers.js'
import {engineTypes, bodyTypes, qualitativeFaults, quantitativeFaults, cars, components} from './data.js';
import reset from './reset.js'

const { PrismaClient } = Prisma
const prisma = new PrismaClient()

faker.locale = "pl";

const stationSeedCount = 55
const carsSeedCount = 50
const inspectionSeedCount = 3333

const seed = async () => {
  await reset(prisma)

  for (let i = 0; i < stationSeedCount; i++) {
    const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);
    await prisma.station.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword,
        name: getMixString([getRandomArg(['Okręgowa', 'Podstawowa']), 'Stacja Diagnostyczna', faker.company.companyName()])
      },
    });
  }
  const hashedPassword = await bcrypt.hash('stacjastacja', 10);
  await prisma.station.create({
    data: {
      email: 'stacja@stacja.com',
      password: hashedPassword,
      name: getMixString([getRandomArg(['Okręgowa', 'Podstawowa']), 'Stacja Diagnostyczna', faker.company.companyName()])
    },
  });

  await Promise.all(components.map(async name => {
    await prisma.component.create({
      data: {
        name
      }
    })
  }))

  await Promise.all(qualitativeFaults.map(async fault => {
    await prisma.qualitativeFault.create({
      data: {
        component: { connect: { name: fault.component } },
        part: fault.part,
        description: fault.description,
        dangerLevels: fault.dangerLevels
      }
    })
  }))

  await Promise.all(quantitativeFaults.map(async fault => {
    await prisma.quantitativeFault.create({
      data: {
        component: { connect: { name: fault.component } },
        part: fault.part,
        description: fault.description,
        minValue: fault.minValue,
        maxValue: fault.maxValue,
        unit: fault.unit,
      }
    })
  }))

  await Promise.all(engineTypes.map(async name => {
    await prisma.engineType.create({
      data: {
        name
      },
    })
  }))

  await Promise.all(bodyTypes.map(async name => {
    await prisma.bodyType.create({
      data: {
        name
      },
    })
  }))

  await Promise.all(cars.map(async car => {
    await prisma.make.create({
      data: {
        name: car.make,
      },
    })
  }))

  await Promise.all(cars.map(async car => {
    await Promise.all(car.models.map(async model => {
      await prisma.model.create({
        data: {
          make: { connect: { name: car.make } },
          name: model.name,
          bodyType: { connect: { name: model.bodyType }},
        },
      })
    }))
  }))

  for(let i = 0; i < carsSeedCount; i++) {
    const car = getRandomArg(cars)

    const make = await prisma.make.findUnique({
      where: {
        name: car.make
      }
    })

    await prisma.car.create({
      data: {
        model: {
          connect: {
            makeId_name: {
              makeId: make.id,
              name: getRandomArg(car.models).name
            }
          }
        },
        engineCapacity: getRandomInt(1000, 4000),
        enginePower: getRandomInt(120, 500),
        engineType: { connect: { name: getRandomArg(engineTypes) } },
      }
    })
  }

  const stationsCount = await prisma.station.count()
  const carsCount = await prisma.car.count()
  const qualitativeFaultCount = await prisma.qualitativeFault.count()
  const quantitativeFaultCount = await prisma.quantitativeFault.count()

  for(let i = 0; i < inspectionSeedCount; i++) {
    const randomStation = await prisma.station.findMany({ take: 1, skip: getRandomInt(1, stationsCount - 1)})
    const randomCar = await prisma.car.findMany({ take: 1, skip: getRandomInt(1, carsCount - 1)})
    const qualitativeFaultsNeeded = getRandomInt(0, 6)
    const randomQualitativeFaults = await prisma.qualitativeFault.findMany({ take: qualitativeFaultsNeeded, skip: getRandomInt(1, qualitativeFaultCount - qualitativeFaultsNeeded)})

    const quantitativeFaultsNeeded = getRandomInt(0, 3)
    const randomQuantitativeFaults = await prisma.quantitativeFault.findMany({ take: quantitativeFaultsNeeded, skip: getRandomInt(1, quantitativeFaultCount - quantitativeFaultsNeeded)})

    await prisma.inspection.create({
      data: {
        station: { connect: { id: randomStation[0].id } },
        car: { connect: { id: randomCar[0].id } },
        mileage: getRandomInt(10, 300000),
        age: getRandomInt(1, 120),
        inspectionQualitativeFaults: {
          create: randomQualitativeFaults.map(fault => {
            return { qualitativeFault: { connect: { id: fault.id } }, dangerLevel: getRandomArg(fault.dangerLevels) }
          })
        },
        inspectionQuantitativeFaults: {
          create: randomQuantitativeFaults.map(fault => {
            return { quantitativeFault: { connect: { id: fault.id } }, value: getRandomInt(0, 100) }
          })
        },
        result: getRandomArg(['NEGATIVE', 'POSITIVE'])
      },
    })
  }
}

seed()
  .catch(e => console.log(e))
  .finally(() => {
    console.log('Seeds have loaded')
    return process.exit()
  })

