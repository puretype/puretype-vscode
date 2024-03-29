import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import Auth from "./auth";
import { PURETYPE_APP_BASE } from "./constants";
import { authenticatedFetch } from "./fetch";
import { Uri } from "vscode";

export default class GraphQLClient {
  constructor(auth: Auth) {
    const httpLink = new HttpLink({
      uri: Uri.joinPath(PURETYPE_APP_BASE, "/graphql").toString(),
      fetch: authenticatedFetch(auth),
    });

    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    });
  }

  client: ApolloClient<unknown>;
}
