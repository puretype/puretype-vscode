import * as vscode from "vscode";
import { Analyzer } from "./analyzer";

class PureTypeCodeAction extends vscode.CodeAction {
  constructor(
    document: vscode.TextDocument,
    range: vscode.Range,
    summary: string,
    public replacement: string,
  ) {
    super(summary, vscode.CodeActionKind.QuickFix);
    this.edit = new vscode.WorkspaceEdit();
    this.edit.replace(
      document.uri,
      new vscode.Range(range.start, range.end),
      replacement,
    );
  }
}

export class PureTypeCodeActionProvider
  implements vscode.CodeActionProvider<PureTypeCodeAction>
{
  constructor(private analyzer: Analyzer) {}

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<PureTypeCodeAction[]> {
    return this.analyzer.getIssue(document, range).then((issue) => {
      if (!issue || !issue.action) {
        return [];
      }

      const range = new vscode.Range(
        new vscode.Position(issue.start.row, issue.start.column),
        new vscode.Position(issue.end.row, issue.end.column),
      );

      return [
        new PureTypeCodeAction(
          document,
          range,
          issue.action.summary,
          issue.action.replacement,
        ),
      ];
    });
  }
}
