import * as vscode from "vscode";

export class PureTypeHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    return new vscode.Hover("Hello, world!");
  }
}
