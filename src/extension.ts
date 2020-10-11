// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import ProjectService from "./services/project.service";
import { TreeProvider } from "./views/tree/tree";
import Axios, { AxiosRequestConfig } from "axios";
import ShowTask from "./views/webview/showTask";
import { Task } from "./models/task.model";
import ImportanceLevelService from "./services/importanceLevel.service";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "hacknplan" is now active!');

  // Set Api Key through Axios interceptor
  const apiKey = vscode.workspace.getConfiguration("hacknplan").get("apiKey");
  if (apiKey) {
    Axios.interceptors.request.use((config: AxiosRequestConfig) => {
      config.headers.Authorization = `ApiKey ${apiKey}`;
      return config;
    });
  }

  const showTaskDetailCommand = vscode.commands.registerCommand(
    "hacknplan.showTask",
    async (task: Task) => {
      const panel = vscode.window.createWebviewPanel(
        "showTaskDetail",
        "Show Task Detail",
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );
      console.log("arg is ok", task);
      panel.webview.html = await ShowTask.showTaskHTML(task);

      // handle patch of task
      panel.webview.onDidReceiveMessage((task: any) => {
        return null;
      });
    }
  );

  context.subscriptions.push(showTaskDetailCommand);

  const treeProvider = new TreeProvider();
  vscode.window.createTreeView("hacknplan", {
    treeDataProvider: treeProvider,
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
