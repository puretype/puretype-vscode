import * as vscode from 'vscode';

const RETURN_URI = `${vscode.env.uriScheme}://puretype.puretype`;

class AuthenticationUriHandler implements vscode.UriHandler {
  handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
    vscode.window.showInformationMessage(uri.query);
  }
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	const authUriHandler = new AuthenticationUriHandler();

	context.subscriptions.push(vscode.window.registerUriHandler(authUriHandler));

	const actionToTake = await vscode.window.showInformationMessage(`Authenticate with PureType`, { modal: false }, { title: 'Login' });

	console.log(actionToTake);

	const uri = await vscode.env.asExternalUri(vscode.Uri.parse('http://localhost:4000/user/login'));
	await vscode.env.openExternal(uri);
}

export function deactivate() {}
