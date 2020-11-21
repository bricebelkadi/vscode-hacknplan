// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import Axios, { AxiosRequestConfig } from "axios";
import * as vscode from "vscode";
import { MessageService } from "./services/message.service";
import { UserService } from "./services/user.service";
import { MainTreeContainer } from "./views/tree/main.tree";
import { TaskWebview } from "./views/webview/task.webview";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "hacknplan" is now active!');
  
  const defineApiCommand = vscode.commands.registerCommand(
    'hacknplan.defineAPIKey',
    MessageService.defineAPIKeyMessage
  );

  context.subscriptions.push(defineApiCommand);

  // Set Api Key through Axios interceptor
  const apiKey = await vscode.workspace.getConfiguration("hacknplan").get("apiKey");
  if (apiKey) {
    Axios.interceptors.request.use((config: AxiosRequestConfig) => {
      config.headers.Authorization = `ApiKey ${apiKey}`;
      return config;
    });
    MainTreeContainer.projectTreeProvider.refresh();
  }

  await UserService.getAndStoreMe();



  // const mainTree = new MainTreeContainer();

  const path = context.extensionPath;

  const taskWebview = new TaskWebview(path);

  context.subscriptions.push(taskWebview.showTaskCommand);

}

// this method is called when your extension is deactivated
export function deactivate() {}
