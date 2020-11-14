/* eslint-disable @typescript-eslint/naming-convention */
import Axios from "axios";
import { SubTask, Task, TaskTreeItem } from "../models/task.model";
import * as vscode from "vscode";
import StorageService from "./storage.service";
import { parse } from "path";

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
      return this.generateTaskTreeItem(task, stageId);
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
    assignedUsersId: string[]
  }) {
    let taskToPatch = {
      title: params.title,
      importanceLevelId: parseInt(params.importanceLevel, 10),
      description: params.description,
      estimatedCost: params.estimatedCost,
      assignedUsersId: params.assignedUsersId.map(x => parseInt(x, 10))
    };
    const result = await Axios.patch(
      `https://api.hacknplan.com/v0/projects/${params.projectId}/workitems/${params.taskId}`,
      taskToPatch,
      { headers: { "Content-Type": "application/json" } }
    );
    let task = result.data as Task;
    let taskItem = TaskService.generateTaskTreeItem(
      result.data,
      task.stage.stageId
    );
    StorageService.updateTask(task.stage.stageId, taskItem);
  }

  static async updateStageTask(
    projectId: number,
    taskId: number,
    stageId: number
  ) {
    const result = await Axios.patch(
      `https://api.hacknplan.com/v0/projects/${projectId}/workitems/${taskId}`,
      { stageId: stageId },
      { headers: { "Content-Type": "application/json" } }
    );
  }


  static async addUserToTask( params : {
    projectId: number,
    taskId: number,
    userId: string
  }
  ) {
    let userId = parseInt(params.userId, 10)
    const result = await Axios.post(
      `https://api.hacknplan.com/v0/projects/${params.projectId}/workitems/${params.taskId}/users`,
      userId,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(result)

  }



  static async deleteUserFromTask( params : {
    projectId: number,
    taskId: number,
    userId: string
  }) {
    const result = await Axios.delete(
      `https://api.hacknplan.com/v0/projects/${params.projectId}/workitems/${params.taskId}/users/${params.userId}`
    );
    console.log(result)
  }


  static async createNewTask() {
    const boardId = StorageService.getBoardId();
    const projectId = StorageService.getProjectId();
    const me = StorageService.getMe();
    let obj: any;
    if (me !== undefined) {
      obj = {
        title: "New Task",
        isStory: false,
        estimatedCost: 0,
        importanceLevelId: 3,
        boardId,
        assignedUserIds: [me.id]
      };
    } else {
      obj = {
        title: "New Task",
        isStory: false,
        estimatedCost: 0,
        importanceLevelId: 3,
        boardId
      };
    }
    const result = await Axios.post(
      `https://api.hacknplan.com/v0/projects/${projectId}/workitems`,
      obj,
      { headers: { "Content-Type": "application/json" } }
    );
    return result.data as Task;
  }

  static generateTaskTreeItem(task: Task, stageId: number) {
    const taskTreeItem = new TaskTreeItem(
      task.title,
      vscode.TreeItemCollapsibleState.Collapsed,
      "Task",
      task.workItemId,
      stageId
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
