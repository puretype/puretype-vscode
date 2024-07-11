import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import * as WebSocket from "ws";
import Auth from "./auth";
import { PURETYPE_APP_BASE } from "./constants";
import { Uri } from "vscode";

export default class GraphQLClient {
  constructor(auth: Auth) {
    const link = new GraphQLWsLink(
      createClient({
        url: Uri.joinPath(PURETYPE_APP_BASE, "/gql/websocket").toString(),
        webSocketImpl: WebSocket,
        connectionParams: async () => ({ token: await auth.getAccessToken() }),
      }),
    );

    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link,
    });
  }

  client: ApolloClient<unknown>;
}
