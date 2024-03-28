import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import Auth from "./auth";
import { authenticatedFetch } from "./fetch";

export default class GraphQLClient {
  constructor(auth: Auth) {
    const httpLink = new HttpLink({
      uri: "https://app.puretype.ai/graphql",
      fetch: authenticatedFetch(auth),
    });

    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    });
  }

  client: ApolloClient<unknown>;
}
