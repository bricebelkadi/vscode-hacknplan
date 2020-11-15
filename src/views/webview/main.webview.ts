import * as vscode from "vscode";
import * as path from "path";
import { Task } from "../../models/task.model";
import StorageService from "../../services/storage.service";
import ShowTask from "./task.webview";
import TaskService from "../../services/task.service";
import { MainTreeContainer } from "../tree/main.tree";

interface IMessageTask {
  command: string;
  params: any;
}

class MainWebviewClass {
  showTaskCommand: vscode.Disposable;
  panelTask: vscode.WebviewPanel;
  cssTask: vscode.Uri;
  jsTask: vscode.Uri;
  cssTaskSrc: vscode.Uri;
  jsTaskSrc: vscode.Uri;

  onDidReceiveMessage = async (message: IMessageTask) => {
    switch (message.command) {
      case "createNewSubTask":
        const newSubTask = await TaskService.createNewSubTask(
          message.params
        );
        return this.panelTask.webview.postMessage({
          command: "createNewSubTaskResponse",
          params: {
            newSubTask,
          },
        });
      case "addAssignedUser":
        await TaskService.addUserToTask(message.params);
        return MainTreeContainer.taskTreeProvider.refresh();
      case "deleteAssignedUser":
        await TaskService.deleteUserFromTask(message.params);
        return MainTreeContainer.taskTreeProvider.refresh();
      case "updateSubTask":
        return await TaskService.updateSubTask(message.params);
      case "deleteSubTask":
        return await TaskService.deleteSubTask(message.params);
      case "updateTask":
        await TaskService.updateTask(message.params);
        return MainTreeContainer.taskTreeProvider.refresh();
    }
  };


  constructor() {
    this.panelTask = vscode.window.createWebviewPanel(
      "showTaskDetail",
      "Show Task Detail",
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );

    this.cssTask = vscode.Uri.file(
      path.join(
        StorageService.getExtensionPath(),
        "src",
        "views",
        "webview",
        "task",
        "styles.css"
      )
    );

    this.jsTask = vscode.Uri.file(
      path.join(
        StorageService.getExtensionPath(),
        "src",
        "views",
        "webview",
        "task",
        "utils.js"
      )
    );

    this.cssTaskSrc = this.panelTask.webview.asWebviewUri(this.cssTask);

    this.jsTaskSrc = this.panelTask.webview.asWebviewUri(this.jsTask);

    this.panelTask.webview.onDidReceiveMessage(this.onDidReceiveMessage);

    this.showTaskCommand = vscode.commands.registerCommand(
      "hacknplan.showTask",
      async (task: Task) => {
        this.panelTask.webview.html = await ShowTask.showTaskHTML(
          task,
          this.cssTaskSrc,
          this.jsTaskSrc
        );

      }
    );


  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MainWebview = new MainWebviewClass();