import bcrypt from "bcrypt";
import { AuthenticationError, ApolloError } from 'apollo-server-express'

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
  },
  Mutation: {
    signUp: async (_parent, { input: { email, password, name } }, ctx) => {
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
  },
};

export default resolvers;
