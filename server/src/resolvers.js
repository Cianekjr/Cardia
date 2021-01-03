import bcrypt from "bcrypt";
import {ApolloError, AuthenticationError} from 'apollo-server-express';

const resolvers = {
  Query: {
    getCurrentStation: async (_parent, args, ctx) => {
      const stationId = ctx.req.session?.station?.id
      if (!stationId) {
        throw new AuthenticationError('Permission denied')
      }

      const station = await ctx.prisma.station.findUnique({
        where: {
          id: stationId,
        },
      });

      if (!station) {
        throw new ApolloError('Station not found')
      }

      station.password = ""

      return station
    },
    getAllCars: async (_parent, args, ctx) => {
      const stationId = ctx.req.session?.station?.id
      if (!stationId) {
        throw new AuthenticationError('Permission denied')
      }

      return await ctx.prisma.car.findMany({
        include: {
          model: {
            include: {
              bodyType: true,
              make: true,
            }
          },
          engineType: true,
        },
      })
    },
    getAllFaults: async (_parent, args, ctx) => {
      const stationId = ctx.req.session?.station?.id
      if (!stationId) {
        throw new AuthenticationError('Permission denied')
      }

      const qualitativeFaults = await ctx.prisma.qualitativeFault.findMany({
        include: {
          component: true,
        },
        orderBy: [
          { part: 'desc' },
          { description: 'desc' },
        ],
      })

      const quantitativeFaults = await ctx.prisma.quantitativeFault.findMany({
        include: {
          component: true,
        },
        orderBy: [
          { part: 'desc' },
          { description: 'desc' },
        ],
      })

      return ({ qualitativeFaults, quantitativeFaults })
    },
    getAllComponents: async (_parent, args, ctx) => {
      const stationId = ctx.req.session?.station?.id
      if (!stationId) {
        throw new AuthenticationError('Permission denied')
      }

      return await ctx.prisma.component.findMany()
    },
    getAnalyticsFilters: async (_parent, args, ctx) => {
      const bodyTypes = await ctx.prisma.bodyType.findMany()
      const makes = await ctx.prisma.make.findMany()
      const models = await ctx.prisma.model.findMany({
        include: {
          make: true,
          bodyType: true,
        }
      })
      const engineTypes = await ctx.prisma.engineType.findMany()

      return { bodyTypes, makes, models, engineTypes }
    },
    getAnalyticsData: async (_parent, { input }, ctx) => {
      const {
        makeId1, bodyTypeId1, modelId1, engineTypeId1,
        makeId2, bodyTypeId2, modelId2, engineTypeId2,
        createdAtMin, createdAtMax,
        mileageMin, mileageMax,
        ageMin, ageMax,
        engineCapacityMin, engineCapacityMax,
        enginePowerMin, enginePowerMax
      } = input || {}

      const resultData = {
        allInspectionsCount1: null,
        allInspectionsCount2: null,
        allStationsCount1: null,
        allStationsCount2: null,
        inspectionResultsData1: null,
        inspectionResultsData2: null,
        componentsFaultsData1: null,
        componentsFaultsData2: null,
        commonQualitativeFaults1: null,
        commonQuantitativeFaults: null,
      }

      const inspections1Filters = {
        createdAt: { gte: createdAtMin, lte: createdAtMax },
        car: {
          model: {
            id: modelId1,
            make: { id: makeId1 },
            bodyType: { id: bodyTypeId1 }
          },
          engineType: { id: engineTypeId1 },
          engineCapacity: { gte: engineCapacityMin, lte: engineCapacityMax },
          enginePower: { gte: enginePowerMin, lte: enginePowerMax },
        },
        mileage: { gte: mileageMin, lte: mileageMax },
        age: { gte: ageMin, lte: ageMax },
      }

      const inspections1 = await ctx.prisma.inspection.findMany({
        include: {
          station: true,
          car: {
            include: {
              model: { include: { make: true, bodyType: true } },
              engineType: true
            },
          },
        },
        where: inspections1Filters
      })

      resultData.allInspectionsCount1 = inspections1.length
      resultData.allStationsCount1 = new Set(inspections1.map(x => x.station.id)).size

      const positiveCount = inspections1.filter(x => x.result === 'POSITIVE').length
      resultData.inspectionResultsData1 = [Math.round(positiveCount * 100 / inspections1.length),  Math.round((inspections1.length - positiveCount) * 100 / inspections1.length)]

      const inspectionQuantitativeFaults = await ctx.prisma.inspectionQuantitativeFault.findMany({
        include: { quantitativeFault: { include: { component: true } } },
        where: { inspection: inspections1Filters }
      })

      const inspectionQualitativeFaults = await ctx.prisma.inspectionQualitativeFault.findMany({
        include: { qualitativeFault: { include: { component: true } } },
        where: { inspection: inspections1Filters }
      })

      const components = await ctx.prisma.component.findMany()
      const qualitativeFaults = await ctx.prisma.qualitativeFault.findMany()
      const quantitativeFaults = await ctx.prisma.quantitativeFault.findMany()

      const stackedComponentsFaults = {}

      components.forEach(component => {
        stackedComponentsFaults[component.name] = 0
      })

      const commonQualitativeFaults = {}
      const commonQuantitativeFaults = {}

      inspectionQuantitativeFaults.concat(inspectionQualitativeFaults).forEach(fault => {
        const qualitativeComponentName = fault.qualitativeFault && fault.qualitativeFault.component.name
        const quantitativeComponentName = fault.quantitativeFault && fault.quantitativeFault.component.name
        if (qualitativeComponentName) {
          const id = fault.qualitativeFault.id
          if (commonQualitativeFaults[id]) {
            commonQualitativeFaults[id]++
          } else {
            commonQualitativeFaults[id] = 1
          }
        } else if (quantitativeComponentName) {
          const id = fault.quantitativeFault.id
          if (commonQuantitativeFaults[id]) {
            commonQuantitativeFaults[id]++
          } else {
            commonQuantitativeFaults[id] = 1
          }
        }
        stackedComponentsFaults[quantitativeComponentName || qualitativeComponentName]++
      })

      const mostCommonQualitativeFaults = Object.entries(commonQualitativeFaults).sort((a, b) => b[1] - a[1]).slice(0, 2).map(item => qualitativeFaults.find(fault => fault.id === Number(item[0])))
      const mostCommonQuantitativeFaults = Object.entries(commonQuantitativeFaults).sort((a, b) => b[1] - a[1]).slice(0, 2).map(item => quantitativeFaults.find(fault => fault.id === Number(item[0])))

      resultData.commonQualitativeFaults1 = mostCommonQualitativeFaults
      resultData.commonQuantitativeFaults1 = mostCommonQuantitativeFaults

      // const stackedComponentsFaults = {}
      // inspections1.forEach(inspection => {
      //   inspection.inspectionQualitativeFaults.forEach(fault => {
      //     if (stackedComponentsFaults[fault.qualitativeFault.component.name]) {
      //       stackedComponentsFaults[fault.qualitativeFault.component.name]++
      //     } else {
      //       stackedComponentsFaults[fault.qualitativeFault.component.name] = 1
      //     }
      //   })
      //
      //   inspection.inspectionQuantitativeFaults.forEach(fault => {
      //     if (stackedComponentsFaults[fault.quantitativeFault.component.name]) {
      //       stackedComponentsFaults[fault.quantitativeFault.component.name]++
      //     } else {
      //       stackedComponentsFaults[fault.quantitativeFault.component.name] = 1
      //     }
      //   })
      // })
      //
      resultData.componentsFaultsData1 = {
        keys: Object.keys(stackedComponentsFaults),
        values: Object.values(stackedComponentsFaults),
      }



      // const mileage = Number.isFinite(mileageMin) && Number.isFinite(mileageMax)
      // const age = Number.isFinite(ageMin) && Number.isFinite(ageMax)
      // if (mileage || age) {
      //   inspections1.
      // }

      // if (makeId2 || bodyTypeId2 || modelId2 || engineTypeId2) {
      //   const inspections2 = await ctx.prisma.inspection.findMany({
      //     include: {
      //       station: true,
      //       car: {
      //         include: {
      //           model: {
      //             include: {
      //               make: true,
      //               bodyType: true
      //             },
      //           },
      //           engineType: true
      //         },
      //       },
      //       inspectionQualitativeFaults: {
      //         include: {
      //           qualitativeFault: {
      //             include: {
      //               component: true,
      //             }
      //           },
      //         },
      //       },
      //       inspectionQuantitativeFaults: {
      //         include: {
      //           quantitativeFault: {
      //             include: {
      //               component: true,
      //             }
      //           },
      //         },
      //       },
      //     },
      //     where: {
      //       createdAt: { gte: createdAtMin, lte: createdAtMax },
      //       car: {
      //         model: {
      //           id: modelId2,
      //           make: { id: makeId2 },
      //           bodyType: { id: bodyTypeId2 }
      //         },
      //         engineType: { id: engineTypeId2 },
      //         engineCapacity: { gte: engineCapacityMin, lte: engineCapacityMax },
      //         enginePower: { gte: enginePowerMin, lte: enginePowerMax },
      //       },
      //       mileage: { gte: mileageMin, lte: mileageMax },
      //       age: { gte: ageMin, lte: ageMax },
      //     }
      //   })
      //
      //   resultData.allInspectionsCount2 = inspections2.length
      //   resultData.allStationsCount2 = new Set(inspections2.map(x => x.station.id)).size
      //
      //   const positiveCount = inspections2.filter(x => x.result === 'POSITIVE').length
      //   resultData.inspectionResultsData2 = [Math.round(positiveCount * 100 / inspections2.length),  Math.round((inspections2.length - positiveCount) * 100 / inspections2.length)]
      //
      //
      //   const stackedComponentsFaults = {}
      //   inspections2.forEach(inspection => {
      //     inspection.inspectionQualitativeFaults.forEach(fault => {
      //       if (stackedComponentsFaults[fault.qualitativeFault.component.name]) {
      //         stackedComponentsFaults[fault.qualitativeFault.component.name]++
      //       } else {
      //         stackedComponentsFaults[fault.qualitativeFault.component.name] = 1
      //       }
      //     })
      //
      //     inspection.inspectionQuantitativeFaults.forEach(fault => {
      //       if (stackedComponentsFaults[fault.quantitativeFault.component.name]) {
      //         stackedComponentsFaults[fault.quantitativeFault.component.name]++
      //       } else {
      //         stackedComponentsFaults[fault.quantitativeFault.component.name] = 1
      //       }
      //     })
      //   })
      //
      //   resultData.componentsFaultsData2 = {
      //     keys: Object.keys(stackedComponentsFaults),
      //     values: Object.values(stackedComponentsFaults),
      //   }
      // }

      return resultData
    },
  },
  Mutation: {
    signUp: async (_parent, { input: { email, password, name } }, ctx) => {
      const existedEmailStation = await ctx.prisma.station.findUnique({
        where: {
          email
        }
      })
      if (existedEmailStation) {
        throw new ApolloError('Email already in use')
      }
      const existedNameStation = await ctx.prisma.station.findUnique({
        where: {
          name
        }
      })
      if (existedNameStation) {
        throw new ApolloError('Name already in use')
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const station = await ctx.prisma.station.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      if (!station) {
        throw new ApolloError('Station cannot be created')
      }

      ctx.req.session.station = {
        id: station.id,
      };
      station.password = ""

      return station;
    },
    signIn: async (_parent, { input: { email, password } }, ctx) => {
      const station = await ctx.prisma.station.findUnique({
        where: {
          email,
        },
      });

      if (!station) {
        throw new ApolloError('Email or password is not correct')
      }

      const passwordMatch = await bcrypt.compare(password, station.password);

      if (passwordMatch) {
        ctx.req.session.station = {
          id: station.id,
        };
        station.password = ""
        return station;
      } else {
        throw new ApolloError('Email or password is not correct')
      }
    },
    logout: async (_parent, _, ctx) => {
      ctx.req.session.station = null
      return true
    },
    createInspection: async (_parent, {
      input: { carId, mileage, age, inspectionQualitativeFaults, inspectionQuantitativeFaults }
      }, ctx) => {
      const stationId = ctx.req.session?.station?.id
      if (!stationId) {
        throw new AuthenticationError('Permission denied')
      }

      const quantitativeFaults = await ctx.prisma.quantitativeFault.findMany()

      const negativeQualitativeFaultsCount = inspectionQualitativeFaults.filter(x => ['SIGNIFICANT', 'MAJOR'].includes(x.dangerLevel)).length
      const negativeQuantitativeFaultsCount = inspectionQuantitativeFaults.filter(x => {
        const item = quantitativeFaults.find(item => item.id === x.quantitativeFaultId)
        if (!item) return true
        const minValueCondition = Number.isFinite(item.minValue) ? x.value >= item.minValue : true
        const maxValueCondition = Number.isFinite(item.maxValue) ? x.value <= item.maxValue : true
        return !(minValueCondition && maxValueCondition)
      }).length

      const inspection = await ctx.prisma.inspection.create({
        data: {
          station: { connect: { id: stationId } },
          car: { connect: { id: carId } },
          mileage,
          age,
          inspectionQualitativeFaults: {
            create: inspectionQualitativeFaults.map(({ qualitativeFaultId, dangerLevel }) => {
              return { qualitativeFault: { connect: { id: qualitativeFaultId } }, dangerLevel }
            })
          },
          inspectionQuantitativeFaults: {
            create: inspectionQuantitativeFaults.map(({ quantitativeFaultId, value }) => {
              return { quantitativeFault: { connect: { id: quantitativeFaultId } }, value }
            })
          },
          result: negativeQualitativeFaultsCount || negativeQuantitativeFaultsCount ? 'NEGATIVE' : 'POSITIVE'
        },
        include: {
          station: true,
          car: {
            include: {
              model: {
                include: {
                  make: true,
                },
              },
            },
          },
          inspectionQualitativeFaults: {
            include: {
              qualitativeFault: {
                include: {
                  component: true,
                }
              },
            },
          },
          inspectionQuantitativeFaults: {
            include: {
              quantitativeFault: {
                include: {
                  component: true,
                }
              },
            },
          },
        },
      })

      return inspection
    },
  },
};

export default resolvers;
