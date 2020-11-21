import { AnySrvRecord } from "dns";
import * as vscode from "vscode";
import { StageTreeItem } from "../../models/stage.model";
import { TaskTreeItem } from "../../models/task.model";
import StageService from "../../services/stage.service";
import StorageService from "../../services/storage.service";
import TaskService from "../../services/task.service";

interface ITaskTree {
  stage: StageTreeItem;
  tasks: TaskTreeItem[];
}


export class TaskTreeProvider implements vscode.TreeDataProvider<AnySrvRecord> {
  private _onDidChangeTreeData: vscode.EventEmitter<void | null> = new vscode.EventEmitter<void | null>();
  readonly onDidChangeTreeData: vscode.Event<void | null> = this._onDidChangeTreeData.event;

  constructor() {}

  getTreeItem(element: any): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: any): Promise<any[]> {
    if (element === null || element === undefined) {
      let boardId = StorageService.getBoardId();
      let projectId = StorageService.getProjectId();
      if (boardId === null || projectId === null) {
        return Promise.resolve([]);
      } else {
        let currentTaskTree = StorageService.getTaskTreeStages();
        if (currentTaskTree.length > 0) {
          return currentTaskTree;
        } else {
          const allStages = StorageService.getAllStages(projectId);
          return StageService.generateStageTreeItems(allStages, boardId);
        }
      }
    } else if (element.contextValue === "stage" && element.boardId && element.stageId) {
      const tasks = StorageService.getTaskTreeTasks(element.stageId);
      if (tasks) {
        return tasks;
      } else {
        return await TaskService.generateTaskTreeItemsForStage(
          element.projectId,
          element.boardId,
          element.stageId
        );
      }
    }
    return Promise.resolve([]);
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}
