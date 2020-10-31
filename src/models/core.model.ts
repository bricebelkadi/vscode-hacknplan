import { StageTreeItem } from "./stage.model";
import { TaskTreeItem } from "./task.model";

export type ModelType = "Project" | "Task" | "Stage" | "Board";

export type Nullable = undefined | null;

export interface ITaskTree {
    isOpened: boolean
    stage: StageTreeItem;
    tasks: TaskTreeItem[];
  }
  