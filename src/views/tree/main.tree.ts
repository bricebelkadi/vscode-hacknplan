import * as vscode from "vscode";
import { StageTreeItem } from "../../models/stage.model";
import { TaskTreeItem } from "../../models/task.model";
import ImportanceLevelService from "../../services/importanceLevel.service";
import { MessageService } from "../../services/message.service";
import StageService from "../../services/stage.service";
import StorageService from "../../services/storage.service";
import TaskService from "../../services/task.service";
import { UserService } from "../../services/user.service";
import { BoardTreeProvider } from "./board.tree";
import { ProjectTreeProvider } from "./project.tree";
import { TaskTreeProvider } from "./task.tree";

class MainTree {
  projectTreeProvider: ProjectTreeProvider;
  projectTree: vscode.TreeView<ProjectTreeProvider>;

  boardTreeProvider: BoardTreeProvider;
  boardTree: vscode.TreeView<BoardTreeProvider>;

  taskTreeProvider: TaskTreeProvider;
  taskTree: vscode.TreeView<TaskTreeProvider>;
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
      treeDataProvider: this.taskTreeProvider,
    });

    vscode.commands.registerCommand(
      "hacknplan.currentProject",
      async (projectId: number) => {
        StorageService.resetTaskTree();
        StorageService.storeProjectId(projectId);
        StorageService.eraseBoardId();
        StorageService.resetBoardTree();
        await ImportanceLevelService.getAndStore(projectId);
        await StageService.getAndStore(projectId);
        await UserService.getAndStore(projectId);
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
        } else {
          return console.log(
            "current project id not defined, in command currentBoard"
          );
        }
      }
    );

    vscode.commands.registerCommand("hacknplan.createNewTask", async () => {
      const newTask = await TaskService.createNewTask();
      vscode.commands.executeCommand("hacknplan.showTask", newTask);
      const firstStageId = StorageService.getFirstStageId();
      let taskTreeItem = TaskService.generateTaskTreeItem(
        newTask,
        firstStageId
      );
      StorageService.pushNewTaskInFirstStage(taskTreeItem);
      this.taskTreeProvider.refresh();
    });

    vscode.commands.registerCommand(
      "hacknplan.changeTaskStage",
      async (task: TaskTreeItem) => {
        const stages = StageService.generateStageQuickPickItem(task.stageId);
        const newStageId = await MessageService.changeStateMessage(
          task,
          stages
        );
        const projectId = StorageService.getProjectId();
        if (newStageId && projectId) {
          await TaskService.updateStageTask(projectId, task.idTask, newStageId);
        }
        this.taskTreeProvider.refresh();
      }
    );

    vscode.commands.registerCommand(
      "hacknplan.refreshStage",
      (stage: StageTreeItem) => {
        StorageService.deleteTaskOfStage(stage.stageId);
        this.taskTreeProvider.refresh();
      }
    );

  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MainTreeContainer = new MainTree();