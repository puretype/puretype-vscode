import * as vscode from "vscode";

export default class Auth {
  constructor({ secrets }: vscode.ExtensionContext) {
    this.secrets = secrets;
  }

  storeAccessToken(accessToken: string): void {
    this.secrets.store("accessToken", accessToken);
  }

  getAccessToken(): Thenable<string | undefined> {
    return this.secrets.get("accessToken");
  }

  private secrets: vscode.SecretStorage;
}
