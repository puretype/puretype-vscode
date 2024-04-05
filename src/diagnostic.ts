import * as vscode from "vscode";
import { Analyzer } from "./analyzer";

export class PureTypeDiagnostics {
  constructor(private analyzer: Analyzer) {}

  activate(context: vscode.ExtensionContext): void {
    const diagnosticCollection =
      vscode.languages.createDiagnosticCollection("puretype");
    context.subscriptions.push(diagnosticCollection);

    vscode.workspace.onDidOpenTextDocument((document) => {
      void this.updateDiagnostics(document, diagnosticCollection);
    });

    vscode.workspace.onDidChangeTextDocument((event) => {
      void this.updateDiagnostics(event.document, diagnosticCollection);
    });
  }

  async updateDiagnostics(
    file: vscode.TextDocument,
    collection: vscode.DiagnosticCollection,
  ): Promise<void> {
    this.analyzer.getIssues(file).then((issues) => {
      const diagnostics: vscode.Diagnostic[] = [];

      for (const issue of issues) {
        const range = new vscode.Range(
          new vscode.Position(issue.start.row, issue.start.column),
          new vscode.Position(issue.end.row, issue.end.column),
        );
        const diagnostic = new vscode.Diagnostic(
          range,
          "Short summary",
          vscode.DiagnosticSeverity.Warning,
        );
        diagnostics.push(diagnostic);
      }

      collection.set(file.uri, diagnostics);
    });
  }
}
