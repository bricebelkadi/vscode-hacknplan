// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ProjectService from './services/project.service';
import { Projectprovider } from './views/tree/tree';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hacknplan" is now active!');
	
		let test = vscode.commands.registerCommand('hacknplan.getAllProjects', ProjectService.getAll);
		const projectProvider = new Projectprovider();
		vscode.window.createTreeView('hacknplan', {
			treeDataProvider: projectProvider
		  });
	
		context.subscriptions.push(test);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hacknplan.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from HackNPlan!');
	});

	context.subscriptions.push(disposable);


}

// this method is called when your extension is deactivated
export function deactivate() {}
