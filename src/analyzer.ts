import GraphQLClient from "./common/graphql";
import { graphql } from "../src/gql";
import { sha256 } from "js-sha256";
import * as vscode from "vscode";
import { AnalyzeCodeQuery } from "./gql/graphql";

const ANALYZE_QUERY = graphql(`
  query analyzeCode(
    $code: String!
    $language: String!
    $repo: String
    $path: String
  ) {
    analyze(code: $code, language: $language, repo: $repo, path: $path) {
      type
      start {
        row
        column
      }
      end {
        row
        column
      }
      summary
      expanded
      action {
        summary
        replacement
      }
    }
  }
`);

export type AnalysisIssue = AnalyzeCodeQuery["analyze"][number];

export class Analyzer {
  constructor(client: GraphQLClient) {
    this.client = client;
  }

  async getIssue(
    textDocument: vscode.TextDocument,
    positionOrRange: vscode.Position | vscode.Range,
  ): Promise<AnalysisIssue | null> {
    const results = await this.getIssues(textDocument);
    for (const result of results) {
      const start = new vscode.Position(result.start.row, result.start.column);
      const end = new vscode.Position(result.end.row, result.end.column);
      const range = new vscode.Range(start, end);

      if (
        (positionOrRange instanceof vscode.Position &&
          positionOrRange.isAfterOrEqual(start) &&
          positionOrRange.isBeforeOrEqual(end)) ||
        (positionOrRange instanceof vscode.Range &&
          range.contains(positionOrRange))
      ) {
        return result;
      }
    }
    return null;
  }

  async getIssues(
    textDocument: vscode.TextDocument,
  ): Promise<readonly AnalysisIssue[]> {
    const code = textDocument.getText();
    const hash = sha256(code);
    const cached = this.resultsCache.get(textDocument.fileName);
    if (cached && cached.hash === hash) {
      return cached.results;
    }

    const results = await this.analyze(
      code,
      textDocument.languageId,
      Analyzer.getFolderName(textDocument),
      Analyzer.getRelativePath(textDocument),
    );
    this.resultsCache.set(textDocument.fileName, { hash, results });
    return results;
  }

  async analyze(
    code: string,
    language: string,
    repo: string | null,
    path: string | null,
  ): Promise<AnalyzeCodeQuery["analyze"]> {
    const {
      data: { analyze },
    } = await this.client.client.query({
      query: ANALYZE_QUERY,
      variables: { code, language, repo, path },
    });

    return analyze;
  }

  private client: GraphQLClient;
  private resultsCache: Map<
    string,
    { hash: string; results: AnalysisIssue[] }
  > = new Map();

  private static getFolderName(
    textDocument: vscode.TextDocument,
  ): string | null {
    const folder = vscode.workspace.getWorkspaceFolder(textDocument.uri);
    return folder ? folder.name : null;
  }

  private static getRelativePath(
    textDocument: vscode.TextDocument,
  ): string | null {
    return vscode.workspace.asRelativePath(textDocument.uri, false);
  }
}
