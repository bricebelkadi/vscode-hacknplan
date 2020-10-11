import User from "./user.model";
import * as vscode from "vscode";
import { ModelType } from "./core.model";

export class Project {
  constructor(obj: any) {
    this.startDate = new Date(obj.startDate);
    this.dueDate = new Date(obj.dueDate);
    this.closingDate = new Date(obj.closingDate);
    this.creationDate = new Date(obj.creationDate);
    Object.assign(this, obj);
  }

  id!: number;
  boardId!: number;
  milestoneId!: number;
  name!: string;
  description!: string;
  generalInfo!: string;
  startDate!: Date;
  dueDate!: Date;
  closingDate!: Date;
  creationDate!: Date;
  creator!: User;
  isDefault!: boolean;
}

export class ProjectTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly type : ModelType,
    public readonly projectId : number
  ) {
    super(label, collapsibleState);
  }
}
