import { AnySrvRecord } from "dns";
import * as vscode from "vscode";
import { Stage } from "../../models/stage.model";
import BoardService from "../../services/board.service";
import ProjectService from "../../services/project.service";
import StorageService from "../../services/storage.service";
import StageService from "../../services/stage.service";
import TaskService from "../../services/task.service";

export class Projectprovider implements vscode.TreeDataProvider<AnySrvRecord> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    void | null
  > = new vscode.EventEmitter<void | null>();
  readonly onDidChangeTreeData: vscode.Event<void | null> = this
    ._onDidChangeTreeData.event;

  constructor() {}

  getTreeItem(element: any): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: any): Promise<any[]> {
    if (element === null || element === undefined) {
      return await ProjectService.generateProjectTreeItems();
    } else {
      if (element.type === "Project" && element.idProject) {
        await ProjectService.handleStages(element.idProject);
        return await BoardService.generateBoardTreeItems(element.idProject);
      }
      if (element.type === "Board" && element.boardId && element.projectId) {
        const allStages = StorageService.getAllStages(element.projectId);
        return StageService.generateStageTreeItems(allStages, element.boardId);
      }
      if (element.type = "Stage" && element.boardId && element.stageId) {
        return await TaskService.generateTaskTreeItemsForStage(element.projectId, element.boardId, element.stageId);
      }
      return Promise.resolve([]);
    }
  }
}
