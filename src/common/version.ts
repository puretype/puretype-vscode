import * as vscode from "vscode";

export const version =
  vscode.extensions.getExtension("puretype.puretype")?.packageJSON.version ??
  null;
