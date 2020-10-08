import ImportanceLevel from "./importanceLevel.model";
import User from "./user.model";
import * as vscode from "vscode";
import { ModelType } from "./core.model";

export class Task {
    constructor(obj: any) {
        this.updateDate = new Date(obj.updateDate);
        this.creationDate = new Date(obj.creationDate);
        Object.assign(this, obj);
    }

    projectId!: number;
    workItemId!: number;
    isStory!: boolean;
    title!: string;
    description!: string;
    category!: any;
    stage!: any;
    estimatedCost!: number;
    loggedCost!: number;
    storyTasksEstimatedCost!: number;
    storyTasksLoggedCost!: number;
    boardIndex!: number;
    designElementIndex!: number;
    updateDate!: Date;
    creationDate!: Date;
    user!: User;
    board!: any;
    assignedUsers!: User[];
    tags!:any[];
    importanceLevel!: ImportanceLevel;
    hasDependencies!: boolean;
    isBlocked!: boolean;

}

export class TaskTreeItem extends vscode.TreeItem {
    constructor(
      public readonly label: string,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState,
      public readonly type : ModelType,
      public readonly idTask : number,
    ) {
      super(label, collapsibleState);
    }
  }
  