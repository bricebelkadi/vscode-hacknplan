import * as vscode from "vscode";
import { IAssignedUsers } from "../../models/core.model";
import ImportanceLevel from "../../models/importanceLevel.model";
import { SubTask, Task } from "../../models/task.model";
import StorageService from "../../services/storage.service";
import TaskService from "../../services/task.service";

export default class ShowTask {
  private static generateSubtasksJS(arr: SubTask[]) {
    let str = "";
    arr.map((subTask: SubTask) => {
      str += `{
        subTaskId: "${subTask.subTaskId}",
        title: "${subTask.title}",
        isCompleted: ${subTask.isCompleted},
      },`;
    });
    return str;
  }

  private static generateSubtasksHTML(arr: SubTask[]) {
    let str = "";
    arr.map((subTask: SubTask) => {
      str += `
      <div class="element sub-task">
        <input type="checkbox" name="isCompleted" data-subTaskId="${subTask.subTaskId}" />
        <span class="parent-switch">
          <span
            data-switch
            data-subTaskId="${subTask.subTaskId}"
            data-type="text"
            data-name="title"
            >${subTask.title}</span>
        </span>
        <span data-delete data-subTaskId="${subTask.subTaskId}" > XXX </span>
      </div>
      `;
    });
    return str;
  }

  private static generateImportanceLevelHTML(
    arr: ImportanceLevel[],
    selected: ImportanceLevel
  ) {
    let str = "";
    arr.map((importanceLevel: ImportanceLevel) => {
      str =
        str +
        `<option value="${importanceLevel.importanceLevelId}" ${
          importanceLevel.importanceLevelId === selected.importanceLevelId
            ? "selected"
            : ""
        }>${importanceLevel.name} </option>`;
    });
    return str;
  }

  private static generateUser(assignedUsers : IAssignedUsers[]) {
    let str ='';
    assignedUsers.map((x: IAssignedUsers) => {
      str += `<span class="user" data-userid="${x.user.id}">
        <span>${x.user.name}</span>
        <span data-userid="${x.user.id}" class="userDelete">X</span>
        </span> `;
    });
    return str;
  }

  private static generateUserJs(arr: IAssignedUsers[]) {
    let str = "";
    arr.map((x: IAssignedUsers) => {
      str += `"${x.user.id}",`;
    });
    return str;
  }

  private static generateAllUserJs(arr:IAssignedUsers[] | undefined) {
    let str = "";
    if (arr === undefined) {
      return str;
    }
    arr.map((x: IAssignedUsers) => {
      str += `{
        id: "${x.user.id}",
        name: "${x.user.name}"
      },`;
    });
    return str;

  }

  static async showTaskHTML(task: Task, cssUri: vscode.Uri, jsUri : vscode.Uri) {
    const importanceLevel = StorageService.getAllImportanceLevel(
      task.projectId
    );

    const allUsers = StorageService.getUsers(task.projectId);

    const subtasks = await TaskService.getSubtaks(
      task.projectId,
      task.workItemId
    );
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Show Task</title>
        <link href="${cssUri}" rel="stylesheet">

      </head>
      <body>
        <div class="main-container" id="mainInfoPanel">
          <div class="element title">
            <span id="idTask">#${task.workItemId}</span>
            <span class="parent-switch">
              <span data-switch data-class="test" data-type="text" data-name="title"
                >${task.title}</span
              >
            </span>
          </div>
          <div class="element col">
            <span class="subtitle">Importance</span>
            <select name="importanceLevel">
              ${this.generateImportanceLevelHTML(
                importanceLevel,
                task.importanceLevel
              )}
            </select>
          </div>
          <div class="element col">
            <span class="subtitle">Estimated Cost</span>
            <span class="parent-switch">
              <span data-switch data-type="text" data-name="estimatedCost"
                >${task.estimatedCost}</span
              >
            </span>
          </div>
          <div class="element col">
            <span class="subtitle">Description</span>
            <span class="parent-switch">
              <span data-switch data-type="textarea" data-name="description">
                ${task.description.length ? task.description : "Not defined"}
              </span>
            </span>
          </div>
          <div class="element col">
          <span class="subtitle">
          <span>User assigned</span>
          <span id="addUser">+</span>
           </span>
          <span id="selectAssignedUser"></span>
          <div class="user-container">
                ${this.generateUser(task.assignedUsers)}
          </div>
          </div>
        </div>

        </div>
        <div class="main-container">
          <div class="element title">
            <span>Sub-Tasks</span>
            <span title="Create a new Sub-task" id="addTask">+</span>
          </div>
          <div id="subtasks">
            ${this.generateSubtasksHTML(subtasks)}
          </div>
        </div>
        <script>
          const allUsers = [
            ${this.generateAllUserJs(allUsers)}
          ]
          const task = {
            stageId: "${task.stage.stageId}",
            projectId: "${task.projectId}",
            taskId: "${task.workItemId}",
            title: "${task.title.length ? task.title : "Not defined"}",
            importanceLevel: "${task.importanceLevel.importanceLevelId}",
            estimatedCost: "${task.estimatedCost}",
            description: "${
              task.description.length > 0 ? task.description : "Not defined"
            }",
            subtasks: [${this.generateSubtasksJS(subtasks)}],
            assignedUsersId: [${this.generateUserJs(task.assignedUsers)}]
          };
        </script>
        <script src="${jsUri}"></script>
      </body>
    </html>
    `;
  }
}
