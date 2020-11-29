import * as vscode from "vscode";

export class Board {
  constructor(obj: any) {
    this.creationDate = new Date(obj.creationDate);
    this.dueDate = new Date(obj.dueDate);
    Object.assign(this, obj);
  }

  projectId!: number;
  boardId!: number;
  milestoneId?: number;
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
    public readonly boardId : number,
    public readonly projectId: number
  ) {
    super(label, collapsibleState);
    this.contextValue = "board";
  }
}

export class MileStone {
  constructor(obj: any) {
    Object.assign(this, obj);
    this.creationDate = new Date(obj.creationDate);
    this.boards = obj.boards.map((x: any) => new Board(x));

  }
  projectId!: number;
  milestoneId!: number;
  name!: string;
  creator!: any;
  creationDate!: Date;
  boards!: Board[];
}

export class MilestoneTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly milestoneId: number,
    public readonly projectId: number,
    
  ) {
    super(label, collapsibleState);
    this.contextValue = "milestone";
  }
}