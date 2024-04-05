import * as vscode from "vscode";
import { Analyzer } from "./analyzer";

export class PureTypeHoverProvider implements vscode.HoverProvider {
  constructor(private analyzer: Analyzer) {}

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    return this.analyzer.getIssue(document, position).then((issue: any) => {
      if (!issue) {
        return null;
      }

      const range = new vscode.Range(
        new vscode.Position(issue.start.row, issue.start.column),
        new vscode.Position(issue.end.row, issue.end.column),
      );

      return new vscode.Hover(new vscode.MarkdownString(issue.message), range);
    });
  }
}
