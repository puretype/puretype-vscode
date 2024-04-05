import * as vscode from "vscode";
import { Analyzer } from "./analyzer";

export class PureTypeCodeActionProvider
  implements vscode.CodeActionProvider<vscode.CodeAction>
{
  constructor(private analyzer: Analyzer) {}

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    return this.analyzer.getIssue(document, range).then((issue) => {
      if (!issue || !issue.action) {
        return [];
      }

      return [
        new vscode.CodeAction(
          issue.action.summary,
          vscode.CodeActionKind.QuickFix,
        ),
      ];
    });
  }
}
