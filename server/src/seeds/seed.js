import faker from 'faker'
import { getRandomArg, getRandomInt, getMixString } from './helpers.js'
import { engineTypes, bodyTypes, qualitativeFaults, cars} from './data.js'
import reset from './reset.js'

faker.locale = "pl";

const seed = async (prisma) => {
  await reset(prisma)

  for(let i = 0; i < 20; i++) {
    await prisma.station.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: getMixString([getRandomArg(['Okręgowa', 'Podstawowa']), 'Stacja Diagnostyczna', faker.company.companyName()])
      },
    });
  }

  await prisma.qualitativeFault.create({
    data: {
      component: 'Układ kierowniczy',
      part: 'Stan przekładni kierowniczej',
      description: 'Mechanizm obraca się ciężko lub z zacięciami',
      dangerLevels: ['MINOR']
    },
  })

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
          name: model,
        },
      })
    }))
  }))

  for(let i = 0; i < 20; i++) {
    await prisma.bodyType.findUnique({
      where: { name: 'SUV' }
    })

    const car = getRandomArg(cars)

    // await prisma.car.create({
    //   data: {
    //     bodyType: { connect: { name: getRandomArg(bodyTypes) } },
    //     // model: { connect: { make: carModel.make, name: getRandomArg(carModel.models) } },
    //     model: { connect: { make_name: { makeId: car.make, name: getRandomArg(car.models) }} },
    //     engineCapacity: getRandomInt(1000, 4000),
    //     enginePower: getRandomInt(120, 500),
    //     engineType: { connect: { name: getRandomArg(engineTypes) } },
    //   }
    // })
  }

  await prisma.quantitativeFault.create({
    data: {
      component: 'Układ hamulcowy',
      part: 'Hamulec roboczsy',
      description: 'Skuteczność hamulca roboczego',
      minValue: 58,
      unit: '%',
    }
  })

  console.log('Seeds have loaded')
}

export default seed

