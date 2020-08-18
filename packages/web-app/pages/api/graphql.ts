import { ApolloServer, gql, makeExecutableSchema } from "apollo-server-micro";
import { userTypeDefs, userResolvers } from "graphql/user";
import merge from "lodash.merge";

const Query = gql`
  type Query {
    _empty: String
  }
`;

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs: [Query, Mutation, userTypeDefs],
  resolvers: merge(resolvers, userResolvers),
});

const apolloServer = new ApolloServer({ schema });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
