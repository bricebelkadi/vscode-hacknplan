import Axios from "axios";
import { Task, TaskTreeItem } from "../models/task.model";
import * as vscode from "vscode";

export default class TaskService {
  static async getAll(projectId: number) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/workitems`
    );
    return result.data.items;
  }

  static async getAllForStage(
    projectId: number,
    boardId: number,
    stageId: number
  ) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/workitems?boardId=${boardId}&stageId=${stageId}`
    );
    return result.data.items;
  }

  static async generateTaskTreeItems(projectId: number) {
    const result = await this.getAll(projectId);
    const taskTreeItems = result.map((task: Task) => {
      return new TaskTreeItem(
        task.title,
        vscode.TreeItemCollapsibleState.Collapsed,
        "Task",
        task.projectId
      );
    });
    return taskTreeItems;
  }

  static async generateTaskTreeItemsForStage(
    projectId: number,
    boardId: number,
    stageId: number
  ) {
    const result = await this.getAllForStage(projectId, boardId, stageId);
    const taskTreeItems = result.map((task: Task) => {
      let taskTreeItem = new TaskTreeItem(
        task.title,
        vscode.TreeItemCollapsibleState.Collapsed,
        "Task",
        task.projectId
      );
      let taskShowCommand: vscode.Command = {
        title: "Show Task Details",
        command: "hacknplan.showTask",
        arguments: [task],
      };
      taskTreeItem.command = taskShowCommand;
      return taskTreeItem;
    });
    return taskTreeItems;
  }
}
