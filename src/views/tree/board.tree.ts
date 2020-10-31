import { AnySrvRecord } from "dns";
import * as vscode from "vscode";
import BoardService from "../../services/board.service";
import StorageService from "../../services/storage.service";

export class BoardTreeProvider implements vscode.TreeDataProvider<AnySrvRecord> {
  private _onDidChangeTreeData: vscode.EventEmitter<void | null> = new vscode.EventEmitter<void | null>();
  readonly onDidChangeTreeData: vscode.Event<void | null> = this._onDidChangeTreeData.event;

  constructor() {}

  getTreeItem(element: any): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: any): Promise<any[]> {
    let projectId = StorageService.getProjectId();
    if (element === null || element === undefined) {
      if (projectId === null || projectId === undefined) {
        return Promise.resolve([]);
      } else {
        return await BoardService.generateBoardTreeItems(projectId);
      }
    }
    return Promise.resolve([]);
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}
