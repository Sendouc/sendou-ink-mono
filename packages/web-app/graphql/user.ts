import { gql } from "apollo-server-micro";

export const userTypeDefs = gql`
  enum PlusStatus {
    ONE
    TWO
  }
`;

export const userResolvers = {};
