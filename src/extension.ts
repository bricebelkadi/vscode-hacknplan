// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import Axios, { AxiosRequestConfig } from "axios";
import * as vscode from "vscode";
import { Task } from "./models/task.model";
import TaskService from "./services/task.service";
import { MainTreeContainer } from "./views/tree/main.tree";
import ShowTask from "./views/webview/showTask";

interface IMessageTask {
  command: string;
  params: any;
}

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

  const mainTree = new MainTreeContainer();

  const showTaskDetailCommand = vscode.commands.registerCommand(
    "hacknplan.showTask",
    async (task: Task) => {
      const panel = vscode.window.createWebviewPanel(
        "showTaskDetail",
        "Show Task Detail",
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );
      panel.webview.html = await ShowTask.showTaskHTML(task);

      // handle patch of task
      panel.webview.onDidReceiveMessage(async (message: IMessageTask) => {
        switch (message.command) {
          case "createNewSubTask":
            const newSubTask = await TaskService.createNewSubTask(
              message.params
            );
            return panel.webview.postMessage({
              command: "createNewSubTaskResponse",
              params: {
                newSubTask,
              },
            });
          case "updateSubTask":
            return await TaskService.updateSubTask(message.params);
          case "deleteSubTask":
            return await TaskService.deleteSubTask(message.params);
          case "updateTask":
            await TaskService.updateTask(message.params);
            return mainTree.taskTreeProvider.refresh();
        }
      });
    }
  );

  context.subscriptions.push(showTaskDetailCommand);

}

// this method is called when your extension is deactivated
export function deactivate() {}
