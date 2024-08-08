import * as vscode from "vscode";

export default class Auth {
  constructor({ secrets }: vscode.ExtensionContext) {
    this.secrets = secrets;
  }

  storeAccessToken(accessToken: string): void {
    this.secrets.store("accessToken", accessToken);
    this.accessTokenSet.fire();
  }

  clearAccessToken(): void {
    this.secrets.delete("accessToken");
    this.accessTokenClear.fire();
  }

  getAccessToken(): Thenable<string | undefined> {
    return this.secrets.get("accessToken");
  }

  private accessTokenSet: vscode.EventEmitter<void> = new vscode.EventEmitter();
  private accessTokenClear: vscode.EventEmitter<void> =
    new vscode.EventEmitter();

  readonly onAccessTokenSet: vscode.Event<void> = this.accessTokenSet.event;
  readonly onAccessTokenClear: vscode.Event<void> = this.accessTokenClear.event;

  private secrets: vscode.SecretStorage;
}
