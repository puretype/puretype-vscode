import gql from "graphql-tag";
import GraphQLClient from "./common/graphql";
import Auth from "./common/auth";

export class Analyzer {
  constructor(auth: Auth) {
    this.client = new GraphQLClient(auth);
  }

  async analyze(code: string): Promise<any> {
    const result = await this.client.client.query({
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
  }

  private client: GraphQLClient;
}
