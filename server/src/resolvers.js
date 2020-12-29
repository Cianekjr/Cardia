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
      input: { carId, mileage, age, inspectionQualitativeFaults, inspectionQuantitativeFaults, result }
      }, ctx) => {
      const stationId = ctx.req.session?.station?.id
      if (!stationId) {
        throw new AuthenticationError('Permission denied')
      }

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
          result: 'NEGATIVE'
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
              qualitativeFault: true,
            },
          },
          inspectionQuantitativeFaults: {
            include: {
              quantitativeFault: true,
            },
          },
        },
      })

      return inspection
    },
  },
};

export default resolvers;
