import * as vscode from "vscode";
import { ProjectTreeProvider } from "./project.tree";
import { BoardTreeProvider } from "./board.tree";
import StorageService from "../../services/storage.service";
import { TaskTreeProvider } from "./task.tree";
import TaskService from "../../services/task.service";
import ImportanceLevelService from "../../services/importanceLevel.service";
import StageService from "../../services/stage.service";
import { Task, TaskTreeItem } from "../../models/task.model";

export class MainTreeContainer {
  projectTreeProvider: ProjectTreeProvider;
  projectTree : vscode.TreeView<ProjectTreeProvider>;

  boardTreeProvider : BoardTreeProvider;
  boardTree : vscode.TreeView<BoardTreeProvider>;

  taskTreeProvider: TaskTreeProvider;
  taskTree : vscode.TreeView<TaskTreeProvider>;
  constructor() {
    this.projectTreeProvider = new ProjectTreeProvider();
    this.projectTree = vscode.window.createTreeView("hacknplanProjects", {
      treeDataProvider: this.projectTreeProvider,
    });

    this.boardTreeProvider = new BoardTreeProvider();
    this.boardTree = vscode.window.createTreeView("hacknplanBoards", {
      treeDataProvider: this.boardTreeProvider,
    });

    this.taskTreeProvider = new TaskTreeProvider();
    this.taskTree = vscode.window.createTreeView("hacknplanTasks", {
      treeDataProvider: this.taskTreeProvider
    });

    // taskTree.onDidExpandElement((x) => StorageService.updateCollapseState(x.element.stageId, vscode.TreeItemCollapsibleState.Expanded));
    // taskTree.onDidCollapseElement((x) => StorageService.updateCollapseState(x.element.stageId, vscode.TreeItemCollapsibleState.Collapsed));

    vscode.commands.registerCommand(
      "hacknplan.currentProject",
      async (projectId: number) => {
        StorageService.resetTaskTree();
        StorageService.storeProjectId(projectId);
        StorageService.eraseBoardId();
        await ImportanceLevelService.getAndStore(projectId);
        await StageService.getAndStore(projectId);
        this.taskTreeProvider.refresh();
        return this.boardTreeProvider.refresh();
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
          return this.taskTreeProvider.refresh();
        }
        else {
          return console.log("current project id not defined, in command currentBoard");
        }
      }
    );

    vscode.commands.registerCommand(
      "hackplan.createNewTask",
      async () => {
        const newTask = await TaskService.createNewTask();
        vscode.commands.executeCommand("hacknplan.showTask", newTask);
        let taskTreeItem = TaskService.generateTaskTreeItem(newTask);
        StorageService.pushNewTaskInFirstStage(taskTreeItem);
        this.taskTreeProvider.refresh();
      }
    );

  }
}