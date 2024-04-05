import * as vscode from "vscode";
import { Analyzer } from "./analyzer";

export class PureTypeDiagnostics {
  constructor(private analyzer: Analyzer) {}

  activate(context: vscode.ExtensionContext): void {
    const diagnosticCollection =
      vscode.languages.createDiagnosticCollection("puretype");
    context.subscriptions.push(diagnosticCollection);

    if (vscode.window.activeTextEditor) {
      void this.updateDiagnostics(
        vscode.window.activeTextEditor.document,
        diagnosticCollection,
      );
    }

    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
          void this.updateDiagnostics(editor.document, diagnosticCollection);
        }
      }),
    );

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

      for (const { start, end, summary } of issues) {
        const range = new vscode.Range(
          new vscode.Position(start.row, start.column),
          new vscode.Position(end.row, end.column),
        );
        const diagnostic = new vscode.Diagnostic(
          range,
          summary,
          vscode.DiagnosticSeverity.Warning,
        );
        diagnostics.push(diagnostic);
      }

      collection.set(file.uri, diagnostics);
    });
  }
}
