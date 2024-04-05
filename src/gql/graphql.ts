/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Action = {
  __typename?: 'Action';
  replacement: Scalars['String']['output'];
  summary: Scalars['String']['output'];
};

export type Position = {
  __typename?: 'Position';
  column: Scalars['Int']['output'];
  row: Scalars['Int']['output'];
};

export type Recommendation = {
  __typename?: 'Recommendation';
  action?: Maybe<Action>;
  end: Position;
  expanded?: Maybe<Scalars['String']['output']>;
  start: Position;
  summary: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  analyze: Array<Recommendation>;
};


export type RootQueryTypeAnalyzeArgs = {
  code: Scalars['String']['input'];
  language: Scalars['String']['input'];
};

export type AnalyzeCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type AnalyzeCodeQuery = { __typename?: 'RootQueryType', analyze: Array<{ __typename?: 'Recommendation', type: string, summary: string, expanded?: string | null, start: { __typename?: 'Position', row: number, column: number }, end: { __typename?: 'Position', row: number, column: number }, action?: { __typename?: 'Action', summary: string, replacement: string } | null }> };


export const AnalyzeCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"analyzeCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"analyze"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"StringValue","value":"elixir","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"start"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"row"}},{"kind":"Field","name":{"kind":"Name","value":"column"}}]}},{"kind":"Field","name":{"kind":"Name","value":"end"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"row"}},{"kind":"Field","name":{"kind":"Name","value":"column"}}]}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"expanded"}},{"kind":"Field","name":{"kind":"Name","value":"action"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"replacement"}}]}}]}}]}}]} as unknown as DocumentNode<AnalyzeCodeQuery, AnalyzeCodeQueryVariables>;