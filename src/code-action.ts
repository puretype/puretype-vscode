import * as vscode from "vscode";
import { Analyzer } from "./analyzer";

class PureTypeCodeAction extends vscode.CodeAction {}

export class PureTypeCodeActionProvider
  implements vscode.CodeActionProvider<PureTypeCodeAction>
{
  constructor(private analyzer: Analyzer) {}

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    return [];
  }
}
