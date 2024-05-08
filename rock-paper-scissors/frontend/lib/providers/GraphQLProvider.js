"use client";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { GRAPHQL_API_URI } from "../const";

const client = new ApolloClient({
  uri: GRAPHQL_API_URI,
  cache: new InMemoryCache(),
});

export default function GraphQLProvider({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
