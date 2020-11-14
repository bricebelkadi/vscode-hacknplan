import { StageTreeItem } from "./stage.model";
import { TaskTreeItem } from "./task.model";
import User from "./user.model";

export type ModelType = "Project" | "Task" | "Stage" | "Board" | "Milestone";

export type Nullable = undefined | null;

export interface ITaskTree {
    stage: StageTreeItem;
    tasks: TaskTreeItem[] | undefined;
  }

  export interface IProjectUsers {
    projectId: number;
    users: IAssignedUsers[];
  } 

  export interface IMe {
    me: User | undefined;
  } 

  export interface IAssignedUsers {
    creationDate: string;
    isActive: boolean;
    isAdmin: boolean;
    projectId: number;
    user: User;
  }