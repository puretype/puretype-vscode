import Auth from "./common/auth";
import { PURETYPE_APP_BASE } from "./common/constants";
import * as vscode from "vscode";
import { PureTypeCodeActionProvider } from "./code-action";
import { PureTypeDiagnostics } from "./diagnostic";
import { Analyzer } from "./analyzer";
import { PureTypeHoverProvider } from "./hover";
import { setupNotifications } from "./notifications";
import GraphQLClient from "./common/graphql";

const LOGIN_URI = vscode.Uri.joinPath(PURETYPE_APP_BASE, "/user/login").with({
  query: "return_url=vscode://puretype.puretype",
});

class AuthenticationUriHandler implements vscode.UriHandler {
  constructor(private readonly auth: Auth) {}

  handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
    const searchParams = new URLSearchParams(uri.query);
    if (searchParams.has("access_token")) {
      const accessToken = searchParams.get("access_token");
      if (accessToken) {
        this.auth.storeAccessToken(accessToken);
        vscode.window.showInformationMessage(
          "Successfully authenticated with PureType!",
        );
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

  auth.onAccessTokenSet(() => {
    initialiseExtension(context, auth);
  });

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
  } else {
    initialiseExtension(context, auth);
  }
}

export function initialiseExtension(
  context: vscode.ExtensionContext,
  auth: Auth,
) {
  const graphqlClient = new GraphQLClient(auth);
  const analyzer = new Analyzer(graphqlClient);

  vscode.languages.registerCodeActionsProvider(
    { scheme: "file", language: "elixir" },
    new PureTypeCodeActionProvider(analyzer),
  );

  vscode.languages.registerHoverProvider(
    { scheme: "file", language: "elixir" },
    new PureTypeHoverProvider(analyzer),
  );

  vscode.commands.registerCommand("puretype.logout", () => {
    auth.clearAccessToken();
  });

  const diagnostics = new PureTypeDiagnostics(analyzer);
  diagnostics.activate(context);

  setupNotifications(graphqlClient);
}

export function deactivate() {}
