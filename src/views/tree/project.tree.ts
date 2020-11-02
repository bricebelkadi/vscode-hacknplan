import { AnySrvRecord } from "dns";
import * as vscode from "vscode";
import ImportanceLevelService from "../../services/importanceLevel.service";
import ProjectService from "../../services/project.service";
import StageService from "../../services/stage.service";

export class ProjectTreeProvider implements vscode.TreeDataProvider<AnySrvRecord> {
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
      if (element.type === "Project" && element.projectId) {
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    }
  }
}
