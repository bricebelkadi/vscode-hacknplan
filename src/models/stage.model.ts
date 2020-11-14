import * as vscode from "vscode";
import { ModelType } from "./core.model";

export class Stage {
  constructor(obj: any) {
    this.creationDate = new Date(obj.creationDate);
    Object.assign(this, obj);
  }

  projectId!: number;
  stageId!: number;
  name!: string;
  icon!: string;
  color!: string;
  status!: string;
  isUnblocker!: boolean;
  creationDate!: Date;
  isOpened?: boolean;
}

export class StageTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly type: ModelType,
    public readonly boardId: number,
    public readonly projectId: number,
    public readonly stageId: number
  ) {
    super(label, collapsibleState);
  }
}

export class StageQuickPick {
  constructor(stage : Stage) {
      this.label = stage.name;
      this.stageId = stage.stageId;
  }
  label: string;
  stageId: number;
}
