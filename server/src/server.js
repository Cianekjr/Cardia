import { ApolloServer } from "apollo-server-express";
import express from 'express';
import session from 'express-session';
import schema from './schema.js';
import prisma from './context.js';

const app = express();

app.use(
  session({
    name: "iq",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/"
    }
  })
);

const cors = {
  credentials: true,
  origin: ["http://199.247.18.7:8080", "http://localhost:8080", "http://client:8080", "http://199.247.18.7" ]
};

const apollo = new ApolloServer({
  schema,
  playground: {
    settings: {
      "request.credentials": "include"
    }
  },
  context: ({ req, res }) => {
    return ({
      req,
      res,
      prisma,
      user: req.session.user
    });

  }
});

apollo.applyMiddleware({ app, cors});

app.listen({port: 3000, cors}, () => {
  console.log('🚀  Server ready at port 3000');
});
