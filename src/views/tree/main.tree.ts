import * as vscode from "vscode";
import { ProjectTreeProvider } from "./project.tree";
import { BoardTreeProvider } from "./board.tree";
import StorageService from "../../services/storage.service";
import { TaskTreeProvider } from "./task.tree";
import TaskService from "../../services/task.service";

export class MainTreeContainer {
  constructor() {
    const projectTreeProvider = new ProjectTreeProvider();
    vscode.window.createTreeView("hacknplanProjects", {
      treeDataProvider: projectTreeProvider,
    });

    const boardTreeProvider = new BoardTreeProvider();
    vscode.window.createTreeView("hacknplanBoards", {
      treeDataProvider: boardTreeProvider,
    });

    const taskTreeProvider = new TaskTreeProvider();
    const taskView = vscode.window.createTreeView("hacknplanTasks", {
      treeDataProvider: taskTreeProvider
    });

    taskView.onDidExpandElement(async (e) => {
      // StorageService.updateCollapseState(e.element.stageId, true);
      // const taskTreeItems = await TaskService.generateTaskTreeItemsForStage(e.element.projectId, e.element.boardId, e.element.stageId);
      // StorageService.updateStageInTaskTree(e.element.stageId, taskTreeItems);
      // return taskTreeProvider.refresh();
    });

    vscode.commands.registerCommand(
      "hacknplan.currentProject",
      (projectId: number) => {
        taskView.reveal(this, {select: false, expand: false});
        StorageService.resetTaskTree();
        StorageService.storeProjectId(projectId);
        StorageService.eraseBoardId();
        taskTreeProvider.refresh();
        return boardTreeProvider.refresh();
      }
    );

    vscode.commands.registerCommand(
      "hacknplan.currentBoard",
      (boardId: number) => {
        StorageService.resetTaskTree();
        StorageService.storeBoardId(boardId);
        let projectId = StorageService.getProjectId();
        if (projectId) {
          StorageService.getAllStages(projectId);
          return taskTreeProvider.refresh();
        }
        else {
          return console.log("current project id not defined, in command currentBoard");
        }
      }
    );

  }
}