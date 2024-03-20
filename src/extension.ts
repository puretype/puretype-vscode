import Auth from "./common/auth";
import { authenticatedFetch } from "./common/fetch";
import * as vscode from "vscode";

const LOGIN_URI = vscode.Uri.parse(
  "https://app.puretype.ai/user/login?return_url=vscode://puretype.puretype",
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

  const authFetch = authenticatedFetch(auth);
  await authFetch("https://app.puretype.ai/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: "vscode",
      messages: [{ level: "info", message: "Hello from VS Code" }],
    }),
  });
}

export function deactivate() {}
