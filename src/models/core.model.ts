import { StageTreeItem } from "./stage.model";
import { TaskTreeItem } from "./task.model";

export type ModelType = "Project" | "Task" | "Stage" | "Board" | "Milestone";

export type Nullable = undefined | null;

export interface ITaskTree {
    stage: StageTreeItem;
    tasks: TaskTreeItem[];
  }
  