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
          padding: 10px;
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
          justify-content: flex-start;
          font-size: large;
        }
        .sub-task {
          box-shadow: 1px solid blue;
          justify-content: flex-start;
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
          const task = {
            taskId: "${task.workItemId}",
            title: "${task.title.length ? task.title : "Not defined"}",
            importanceLevel: "${task.importanceLevel.importanceLevelId}",
            estimatedCost: "${task.estimatedCost}",
            description: "${
              task.description.length > 0 ? task.description : "Not defined"
            }",
            subtasks: [${this.generateSubtasksJS(subtasks)}],
          };
    
          function createNewSubTask(subTask) {
            vscode.postMessage({
              command: "createNewSubTask",
              taskId: task.taskId,
              subTask
            })
          }
    
          function handleEstimatedCostFromInput(e) {
            const match = e.target.value.match(/(\\d+)h?(?:\\s(\\d+)(?:m)?)?/);
            let value = 0;
            let h = 0;
            let m = 0;
            console.log(e)
            console.log(match);
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
            console.log("e", e);
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
            console.log(e);
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
            } else if (e.target.getAttribute("data-subTaskId")) {
              let index = task.subtasks.findIndex(
                (x) => x.subTaskId === e.target.getAttribute("data-subTaskId")
              );
              task.subtasks[index].title = e.target.value;
              newSpan.innerHTML =  e.target.value.length > 0 ? e.target.length : "Not defined";
              if (e.target.getAttribute('data-subTaskId') === "0") createNewSubTask(task.subtasks[index])
            } else {
              task[e.target.name] = e.target.value;
              newSpan.innerHTML =  e.target.value.length > 0 ? e.target.length : "Not defined";
            }
            console.log("task", task);
            let parentElement = e.target.parentElement;
            parentElement.firstElementChild.remove();
            parentElement.appendChild(newSpan);
            newSpan.addEventListener("click", spanToInput);
          }
    
          let switchInputs = document.querySelectorAll("span[data-switch]");
          [...switchInputs].map((span) => {
            span.addEventListener("click", spanToInput);
          });
    
          document.querySelector("select").addEventListener("change", (e) => {
            task.importanceLevel = e.target.value;
            console.log(task);
          });
    
          let checkboxSubtasks = document.querySelectorAll(
            "input[type='checkbox']"
          );
          [...checkboxSubtasks].map((checkbox) =>
            checkbox.addEventListener("change", (e) => {
              console.log(e);
              let id = e.target.getAttribute("data-subTaskId");
              let index = task.subtasks.findIndex((x) => x.subTaskId === id);
              task.subtasks[index].isCompleted = e.target.checked;
              console.log(task)
            })
          );
    
          document.getElementById('addTask').addEventListener('click', () => {
            let newSubtask = {
              subTaskId: 0,
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
            div.appendChild(parentSwitch)
            document.getElementById("subtasks").prepend(div);
            input.focus();
            input.addEventListener("blur", inputToSpan);
          })
        </script>
      </body>
    </html>
    `;
  }
}
