import bcrypt from "bcrypt";
import { AuthenticationError, ApolloError } from 'apollo-server-express'

const resolvers = {
  Query: {
    user: async (_parent, args, ctx) => {
      const userId = ctx.req.session?.user?.id
      if (!userId) {
        throw new AuthenticationError('Permission denied')
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          station: true
        }
      });

      if (!user) {
        throw new ApolloError('User not found')
      }

      user.password = ""

      return user
    },
  },
  Mutation: {
    signupUser: async (_parent, { input: { email, password, role } }, ctx) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });

      if (!user) {
        throw new ApolloError('User cannot be created')
      }

      ctx.req.session.user = {
        id: user.id,
        role: user.role,
        stationId: user.station?.id,
      };
      user.password = ""
      return user;
    },
    loginUser: async (_parent, { input: { email, password } }, ctx) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          station: true
        }
      });

      if (!user) {
        throw new ApolloError('Email or password is not correct')
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        ctx.req.session.user = {
          id: user.id,
          role: user.role,
          stationId: user.station?.id,
        };
        user.password = ""
        return user;
      } else {
        throw new ApolloError('Email or password is not correct')
      }
    },
    createStation: async (_parent, { input: { name } }, ctx) => {
      const userId = ctx.req.session?.user?.id
      if (!userId) {
        throw new AuthenticationError('Permission denied')
      }
      const isDiagnostician = ctx.req.session?.user?.role === 'DIAGNOSTICIAN'
      if (!isDiagnostician) {
        throw new ApolloError('Only diagnosticians are able to create stations')
      }
      const station = await ctx.prisma.station.create({
        data: {
          name,
          user: {
            connect: {
              id: userId
            }
          }
        },
      });

      if (!station) {
        throw new ApolloError('Station cannot be created')
      }

      ctx.req.session.user.stationId = station.id
      return station
    }
  },
};

export default resolvers;
