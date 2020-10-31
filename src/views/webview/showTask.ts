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
          width: 95%;
          height: 100%;
          display: flex;
          flex-direction: column;

        }
        .main-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
          margin: 20px;
          box-shadow: 0 1px 6px rgba(25,25,25,.8);
          background-color: #454545;
          border-radius: 3px;
        }
        .element {
          display: flex;
          width: 100%;
          justify-content: center;
          padding:5px;
        }
        .col {
          flex-direction: column;
        }
        .input {
          width: 80%;
        }
        .title {
          justify-content: flex-start;
          font-size: xx-large;
          padding-bottom: 10px;
        }
        .sub-task {
          justify-content: flex-start;
          padding: 7px;
          border-radius: 3px;
          color: rgb(221, 221, 221);
          box-shadow: rgba(25, 25, 25, 0.8) 0px 1px 6px 0px;
          margin-bottom: 10px;
        }
        #subtasks {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        span[data-delete] {
          margin-left: auto;
        }
        input[type="checkbox"] {
          margin-right : 2px;
          margin-left : 2px;
        }
        .parent-switch {
          width: auto;
          height: auto;
          /* display: flex;
          justify-content: center;
          align-self: center; */
        }
        textarea {
          width: 100%;
        }
        subtitle {
          font-size: large;
          padding-bottom: 5px;
        }
      </style>
      <body>
        <div class="main-container" id="mainInfoPanel">
          <div class="element title">
            <span>#${task.workItemId}</span>
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
            <!-- <textarea name="description" cols="30" rows="10"></textarea> -->
          </div>
        </div>
        <div class="main-container">
          <div class="element title">
            <span>Sub-Tasks</span>
            <span id="addTask">+</span>
          </div>
          <div id="subtasks">
            ${this.generateSubtasksHTML(subtasks)}
          </div>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
        
          function updateNewSubtask(subtask) {
            let index = task.subtasks.findIndex(subtask => subtask.subTaskId === "0");
            task.subtasks[index].subTaskId = subtask.subTaskId.toString();
            let elems = document.querySelectorAll('[data-subtaskid="0"]')
            elems.map(x => x.setAttribute("data-subTaskId", subtask.subTaskId.toString()))
            console.log(task)
          }

          function updateTask() {
            vscode.postMessage({
              command: "updateTask",
              params: {
                projectId: task.projectId,
                taskId: task.taskId,
                title : task.title,
                importanceLevel: task.importanceLevel,
                estimatedCost: task.estimatedCost,
                description: task.description
              }
            })
          }      
                        

          const task = {
            projectId: "${task.projectId}",
            taskId: "${task.workItemId}",
            title: "${task.title.length ? task.title : "Not defined"}",
            importanceLevel: "${task.importanceLevel.importanceLevelId}",
            estimatedCost: "${task.estimatedCost}",
            description: "${
              task.description.length > 0 ? task.description : "Not defined"
            }",
            subtasks: [${this.generateSubtasksJS(subtasks)}],
          };

          function updateSubtask(subTask) {
            let index = task.subtasks.findIndex(sb => sb.subTaskId === subTask.subTaskId);
            vscode.postMessage({
                command: "updateSubTask",
                params: {
                  projectId: task.projectId,
                  taskId: task.taskId,
                  subTask
                }
              })
          }
      
    
          function createNewSubTask(subTask) {
            vscode.postMessage({
              command: "createNewSubTask",
              params: {
                projectId: task.projectId,
                taskId: task.taskId,
                subTask
              }
            })
          }

          function deleteSubtask(e) {
            let subTaskId = e.target.getAttribute('data-subTaskId');
            if (!subTaskId) return;
            let index = task.subtasks.findIndex(x => x.subTaskId === subTaskId);
            vscode.postMessage({
                    command: "deleteSubTask",
                    params: {
                      projectId: task.projectId,
                      taskId: task.taskId,
                      subTask: task.subtasks[index]
                    }
                  })
            task.subtasks.splice(index, 1);
            e.target.parentElement.remove();
          }
        
            
          function handleEstimatedCostFromInput(e) {
            const match = e.target.value.match(/(\\d+)h?(?:\\s(\\d+)(?:m)?)?/);
            let value = 0;
            let h = 0;
            let m = 0;
            if (match) {
              value = parseInt(match[1], 10);
              if (parseInt(match[2], 10) < 61) {
                h = value;
                m = parseInt(match[2], 10);
                value += m / 60;
              } else if (parseInt(match[2], 10) > 60) {
                h = Math.trunc(parseInt(match[2], 10) / 60);
                value += h;
                h = value;
                m = parseInt(match[2], 10) % 60;
                value += m / 60;
              }
    
              return {
                text: Math.trunc(h).toString() + "h" + (m > 0 ? " " + m + "m" : ""),
                value,
              };
            }
            return {
              text: "0h",
              value: 0,
            };
          }
    
          function spanToInput(e) {
            let isTextarea = e.target.getAttribute("data-type") === "textarea";
            let input = isTextarea
              ? document.createElement("textarea")
              : document.createElement("input");
            if (!isTextarea) {
              input.setAttribute("type", e.target.getAttribute("data-type"));
              input.setAttribute("value", e.target.innerHTML);
            } else input.innerHTML = e.target.innerHTML;
            if (e.target.getAttribute("data-class"))
              input.setAttribute("class", e.target.getAttribute("data-class"));
            if (e.target.getAttribute("data-subTaskId")) {
              input.setAttribute(
                "data-subTaskId",
                e.target.getAttribute("data-subTaskId")
              );
            }
            input.setAttribute("name", e.target.getAttribute("data-name"));
            let parentElement = e.target.parentElement;
            parentElement.firstElementChild.remove();
            parentElement.appendChild(input);
            input.focus();
            input.addEventListener("blur", inputToSpan);
          }
    
          function inputToSpan(e) {
            let isTextarea = e.target.tagName === "TEXTAREA";
            let newSpan = document.createElement("span");
            newSpan.setAttribute("data-switch", "");
            newSpan.setAttribute("data-class", e.target.className);
            newSpan.setAttribute(
              "data-type",
              isTextarea ? "textarea" : e.target.tagName.toLowerCase()
            );
            if (e.target.getAttribute("data-subTaskId")) {
              newSpan.setAttribute(
                "data-subTaskId",
                e.target.getAttribute("data-subTaskId")
              );
            }
            newSpan.setAttribute("data-name", e.target.name);
            if (e.target.name === "estimatedCost") {
              let result = handleEstimatedCostFromInput(e);
              task[e.target.name] = result.value;
              newSpan.innerHTML = result.text;
              updateTask();
            } else if (e.target.getAttribute("data-subTaskId")) {
              let subtaskId = e.target.getAttribute("data-subTaskId");
              let index = task.subtasks.findIndex(
                (x) => x.subTaskId === subtaskId
              );
              if (index > -1) task.subtasks[index].title = e.target.value;
              newSpan.innerHTML =  e.target.value.length > 0 ? e.target.value : "Not defined";
              if (e.target.getAttribute('data-subTaskId') === "0") createNewSubTask(task.subtasks[index])
              else updateSubtask(task.subtasks[index])
            } else {
              task[e.target.name] = e.target.value;
              newSpan.innerHTML =  e.target.value.length > 0 ? e.target.value : "Not defined";
              updateTask();
            }
            console.log("task", task);
            let parentElement = e.target.parentElement;
            parentElement.firstElementChild.remove();
            parentElement.appendChild(newSpan);
            newSpan.addEventListener("click", spanToInput);
          }
    

          function handleIsCompleted (e) {
            let id = e.target.getAttribute("data-subTaskId");
            let index = task.subtasks.findIndex((x) => x.subTaskId === id);
            task.subtasks[index].isCompleted = e.target.checked;
            updateSubtask(task.subtasks[index])
            console.log(task)
          }

          document.addEventListener("DOMContentLoaded", () => {
  
            window.addEventListener('message', message => {
              switch(message.data.command) {
                case "createNewSubTaskResponse":
                  updateNewSubtask(message.data.params.newSubTask)
              }
            })
  
            let switchInputs = document.querySelectorAll("span[data-switch]");
            [...switchInputs].map((span) => {
              span.addEventListener("click", spanToInput);
            });
      
            document.querySelector("select").addEventListener("change", (e) => {
              task.importanceLevel = e.target.value;
              updateTask();
            });

            let checkboxSubtasks = document.querySelectorAll(
              "input[type='checkbox']"
            );
            [...checkboxSubtasks].map((checkbox) =>
              checkbox.addEventListener("change", handleIsCompleted)
            );
      
            document.getElementById('addTask').addEventListener('click', () => {
              let newSubtask = {
                subTaskId: "0",
                title: "",
                isCompleted: false
              };
              task.subtasks.push(newSubtask);
              let div = document.createElement("div");
              div.setAttribute("class", "element sub-task");
              let checkbox = document.createElement("input");
              checkbox.setAttribute("type", "checkbox");
              checkbox.setAttribute("name", "isCompleted");
              checkbox.setAttribute('data-subTaskId', "0");
              div.appendChild(checkbox);
              let parentSwitch = document.createElement('span');
              parentSwitch.setAttribute("class", "parent-switch");
              let input = document.createElement("input");
              input.setAttribute("type", "text");
              input.setAttribute('data-subTaskId', '0');
              input.setAttribute('name', "title");
              parentSwitch.appendChild(input);
              div.appendChild(parentSwitch);
              let spanDelete = document.createElement('span');
              spanDelete.setAttribute('data-subTaskId', "0");
              spanDelete.setAttribute('data-delete', "true");
              div.appendChild(spanDelete);
              document.getElementById("subtasks").prepend(div);
              input.focus();
              input.addEventListener("blur", inputToSpan);
              spanDelete.addEventListener('click', deleteSubtask);
              checkbox.addEventListener('change', handleIsCompleted)
                })

                let deleteSubTasks = document.querySelectorAll("span[data-delete][data-subtaskid]");
                [...deleteSubTasks].map(x => {
                  addEventListener('click', deleteSubtask)
                });
    
    
          });

    
        </script>
      </body>
    </html>
    `;
  }
}
