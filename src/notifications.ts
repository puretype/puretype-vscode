import GraphQLClient from "./common/graphql";
import { graphql } from "../src/gql";
import * as vscode from "vscode";

const SUBSCRIPTION = graphql(`
  subscription newNotification {
    newNotification
  }
`);

export function setupNotifications(graphqlClient: GraphQLClient): void {
  const observer = graphqlClient.client.subscribe({
    query: SUBSCRIPTION,
  });

  observer.subscribe({
    next: ({ data }) => {
      vscode.window.showInformationMessage(data!.newNotification);
    },
    error: (error) => {
      console.error(error);
    },
  });
}
