/* eslint-disable @typescript-eslint/naming-convention */
import Axios from "axios";
import { SubTask, Task, TaskTreeItem } from "../models/task.model";
import * as vscode from "vscode";
import StorageService from "./storage.service";

export default class TaskService {
  static async getAll(projectId: number) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/workitems`
    );
    return result.data.items;
  }

  static async getSubtaks(projectId: number, taskId: number) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/workitems/${taskId}/subtasks`
    );
    return result.data as SubTask[];
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

  static async generateTaskTreeItemsForStage(
    projectId: number,
    boardId: number,
    stageId: number
  ) {
    const result = await this.getAllForStage(projectId, boardId, stageId);
    const taskTreeItems: TaskTreeItem[] = result.map((task: Task) => {
      return this.generateTaskTreeItem(task);
    });
    StorageService.updateStageInTaskTree(stageId, taskTreeItems);
    return taskTreeItems;
  }

  static async createNewSubTask(params: {
    projectId: number;
    taskId: number;
    subTask: SubTask;
  }) {
    const result = await Axios.post(
      `https://api.hacknplan.com/v0/projects/${params.projectId}/workitems/${params.taskId}/subtasks`,
      `"${params.subTask.title}"`,
      { headers: { "Content-Type": "application/json" } }
    );
    return result.data;
  }

  static async updateSubTask(params: {
    projectId: number;
    taskId: number;
    subTask: SubTask;
  }) {
    const objToModify = {
      title: params.subTask.title,
      isCompleted: params.subTask.isCompleted,
    };
    const result = await Axios.patch(
      `https://api.hacknplan.com/v0/projects/${params.projectId}/workitems/${params.taskId}/subtasks/${params.subTask.subTaskId}`,
      objToModify,
      { headers: { "Content-Type": "application/json" } }
    );
    return result.data;
  }

  static async deleteSubTask(params: {
    projectId: number;
    taskId: number;
    subTask: SubTask;
  }) {
    const result = await Axios.delete(
      `https://api.hacknplan.com/v0/projects/${params.projectId}/workitems/${params.taskId}/subtasks/${params.subTask.subTaskId}`
    );
    return result.data;
  }

  static async updateTask(params: {
    projectId: number;
    taskId: number;
    title: string;
    importanceLevel: string;
    estimatedCost: number;
    description: string;
  }) {
    let taskToPatch = {
      title: params.title,
      importanceLevelId: parseInt(params.importanceLevel, 10),
      description: params.description,
      estimatedCost: params.estimatedCost,
    };
    const result = await Axios.patch(
      `https://api.hacknplan.com/v0/projects/${params.projectId}/workitems/${params.taskId}`,
      taskToPatch,
      { headers: { "Content-Type": "application/json" } }
    );
    let task = result.data as Task;
    let taskItem = TaskService.generateTaskTreeItem(result.data);
    StorageService.updateTask(task.stage.stageId, taskItem);
  }

  static async createNewTask() {
    const boardId = StorageService.getBoardId();
    const projectId = StorageService.getProjectId();
    const obj = {
      title: "New Task",
      isStory: false,
      estimatedCost: 0,
      importanceLevelId: 3,
      boardId,
    };
    const result = await Axios.post(
      `https://api.hacknplan.com/v0/projects/${projectId}/workitems`,
      obj,
      { headers: { "Content-Type": "application/json" } }
    );
    return result.data as Task;
  }

  static generateTaskTreeItem(task: Task) {
    const taskTreeItem = new TaskTreeItem(
      task.title,
      vscode.TreeItemCollapsibleState.Collapsed,
      "Task",
      task.workItemId
    );
    let taskShowCommand: vscode.Command = {
      title: "Show Task Details",
      command: "hacknplan.showTask",
      arguments: [task],
    };
    taskTreeItem.command = taskShowCommand;
    return taskTreeItem;
  }
}
