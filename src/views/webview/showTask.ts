import ImportanceLevel from "../../models/importanceLevel.model";
import { SubTask, Task } from "../../models/task.model";
import StorageService from "../../services/storage.service";
import TaskService from "../../services/task.service";

export default class ShowTask {
  private static generateSubtasksHTML(arr: SubTask[]) {
    let str = "";
    arr.map((subTask: SubTask) => {
      str =
        str +
        ` <div class="element sub-task"><input type="checkbox" name="${
          subTask.subTaskId
        }" ${subTask.isCompleted ? "checked" : ""}><span>${*
          subTask.title
        }</span></div>`;
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
        `<option value="${importanceLevel.importanceLevelId}">${
          importanceLevel.name
        } ${
          importanceLevel.importanceLevelId === selected.importanceLevelId
            ? "selected"
            : ""
        }</option>`;
    });
    return str;
  }

  static async showTaskHTML(task: Task) {
    const importanceLevel = StorageService.getAllImportanceLevel(
      task.projectId
    );

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
          </head>
          <style>
            body {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            .main-container {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            .element {
              display: flex;
              width: 100%;
              justify-content: center;
            }
            .col {
              flex-direction: column;
            }
            .input {
              width: 80%;
            }
            .title {
              font-size: large;
            }
            .sub-task {
              box-shadow: 1px solid blue;
            }
          </style>
          <body>
            <div class="main-container">
              <div class="element">
                <span class="title">#${task.workItemId}</span>
                <span>${task.title}</span>
              </div>
              <div class="element col">
                <span class="subtitle">Importance</span>
                <select name="importanceLevel">
                ${this.generateImportanceLevelHTML(importanceLevel, task.importanceLevel)}
                </select>
              </div>
              <div class="element col">
                <span class="subtitle">Estimated Cost</span>
                <input type="text" name="estimatedCost" value="${task.estimatedCost}">
              </div>
              <div class="element col">
                <span class="subtitle">Description</span>
                <textarea name="description"  cols="30" rows="10">${task.description}</textarea>
              </div>
            </div>
            <div class="main-container">
              <div class="element">
                <span class="title">Sub-Tasks</span>
                <span>+</span>
              </div>
              ${this.generateSubtasksHTML(subtasks)}
            </div>
          </body>
        </html>
        `;
  }
}
