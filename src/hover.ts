import * as vscode from "vscode";
import { Analyzer } from "./analyzer";

export class PureTypeHoverProvider implements vscode.HoverProvider {
  constructor(private analyzer: Analyzer) {}

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    return this.analyzer.getHover(document, position);
  }
}
