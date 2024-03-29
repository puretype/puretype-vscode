import * as vscode from "vscode";

class PureTypeCodeAction extends vscode.CodeAction {}

export class PureTypeCodeActionProvider
  implements vscode.CodeActionProvider<PureTypeCodeAction>
{
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    return [];
  }
}
