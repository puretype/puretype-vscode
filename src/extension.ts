import { gql } from "@apollo/client/core";
import Auth from "./common/auth";
import { PURETYPE_APP_BASE } from "./common/constants";
import * as vscode from "vscode";
import GraphQLClient from "./common/graphql";

const LOGIN_URI = vscode.Uri.joinPath(
  PURETYPE_APP_BASE,
  "/user/login?return_url=vscode://puretype.puretype",
);

class AuthenticationUriHandler implements vscode.UriHandler {
  constructor(private readonly auth: Auth) {}

  handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
    const searchParams = new URLSearchParams(uri.query);
    if (searchParams.has("access_token")) {
      const accessToken = searchParams.get("access_token");
      if (accessToken) {
        this.auth.storeAccessToken(accessToken);
      }
    }
  }
}

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  const auth = new Auth(context);
  const authUriHandler = new AuthenticationUriHandler(auth);
  context.subscriptions.push(vscode.window.registerUriHandler(authUriHandler));

  const accessToken = await auth.getAccessToken();
  if (!accessToken) {
    const actionToTake = await vscode.window.showInformationMessage(
      `Authenticate with PureType`,
      { modal: false },
      { title: "Login" },
    );

    if (actionToTake?.title === "Login") {
      const uri = await vscode.env.asExternalUri(LOGIN_URI);
      await vscode.env.openExternal(uri);
    }
  }

  const graphqlClient = new GraphQLClient(auth);
  await graphqlClient.client.query({
    query: gql`
      {
        analyze(code: "fn x -> x.f end", language: "elixir") {
          line
          column
          code
          explanation
        }
      }
    `,
  });
}

export function deactivate() {}
