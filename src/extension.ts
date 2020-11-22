// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import Axios, { AxiosRequestConfig } from "axios";
import * as vscode from "vscode";
import { Task } from "./models/task.model";
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

  const showTaskCommand = vscode.commands.registerCommand(
    "hacknplan.showTask",
    async (task: Task) => {
      const taskWebview = new TaskWebview(context.extensionPath);
      let html = await taskWebview.showTaskHTML(
        task,
        taskWebview.cssTaskSrc,
        taskWebview.jsTaskSrc
      );
      taskWebview.panelTask.webview.html = html;

    }
  );
  
  context.subscriptions.push(showTaskCommand);

}

// this method is called when your extension is deactivated
export function deactivate() {}
