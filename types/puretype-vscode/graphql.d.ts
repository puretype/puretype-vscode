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

export type Position = {
  __typename?: 'Position';
  column: Scalars['Int']['output'];
  row: Scalars['Int']['output'];
};

export type Recommendation = {
  __typename?: 'Recommendation';
  end: Position;
  message: Scalars['String']['output'];
  replacement: Scalars['String']['output'];
  start: Position;
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

export type Unnamed_1_QueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type Unnamed_1_Query = { __typename?: 'RootQueryType', analyze: Array<{ __typename?: 'Recommendation', type: string, replacement: string, message: string, start: { __typename?: 'Position', row: number, column: number }, end: { __typename?: 'Position', row: number, column: number } }> };
