import * as vscode from "vscode";
import { ModelType } from "./core.model";

export class Board {
  constructor(obj: any) {
    this.creationDate = new Date(obj.creationDate);
    this.dueDate = new Date(obj.dueDate);
    Object.assign(this, obj);
  }

  projectId!: number;
  boardId!: number;
  name!: string;
  description!: string;
  dueDate!: Date;
  creationDate!: Date;
  isDefault!: boolean;
}

export class BoardTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly type : ModelType,
    public readonly boardId : number,
    public readonly projectId: number
  ) {
    super(label, collapsibleState);
  }
}