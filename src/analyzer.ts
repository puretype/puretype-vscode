import gql from "graphql-tag";
import GraphQLClient from "./common/graphql";
import Auth from "./common/auth";
import { sha256 } from "js-sha256";
import * as vscode from "vscode";

export class Analyzer {
  constructor(auth: Auth) {
    this.client = new GraphQLClient(auth);
  }

  getHover(
    textDocument: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.ProviderResult<vscode.Hover> {
    return this.getResults(textDocument).then((results: any) => {
      for (const result of results) {
        console.log({
          position,
          start: result.start,
          end: result.end,
        });
      }

      return null;
    });
  }

  private async getResults(textDocument: vscode.TextDocument): Promise<any> {
    const code = textDocument.getText();
    const hash = sha256(code);
    const cached = this.resultsCache.get(textDocument.fileName);
    if (cached && cached.hash === hash) {
      return cached.results;
    }

    const results = await this.analyze(code);
    this.resultsCache.set(textDocument.fileName, { hash, results });
    return results;
  }

  async analyze(code: string): Promise<any> {
    const {
      data: { analyze },
    } = await this.client.client.query({
      query: gql`
        query ($code: String!) {
          analyze(code: $code, language: "elixir") {
            type
            start {
              row
              column
            }
            end {
              row
              column
            }
            replacement
            message
          }
        }
      `,
      variables: { code },
    });

    return analyze;
  }

  private client: GraphQLClient;
  private resultsCache: Map<string, { hash: string; results: any }> = new Map();
}
