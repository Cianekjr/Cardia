import { makeExecutableSchema } from "apollo-server-express";

import resolvers from "./resolvers.js";
import typeDefs from "./typeDefs.js";

const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: [resolvers],
});

export default schema
