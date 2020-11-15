const vscode = acquireVsCodeApi();





function updateNewSubtask(subtask) {
    let index = task.subtasks.findIndex(subtask => subtask.subTaskId === "0");
    task.subtasks[index].subTaskId = subtask.subTaskId.toString();
    let elems = document.querySelectorAll('[data-subtaskid="0"]');
    [...elems].map(x => x.setAttribute("data-subTaskId", subtask.subTaskId.toString()));
}

function updateTask() {
    vscode.postMessage({
        command: "updateTask",
        params: {
            projectId: task.projectId,
            taskId: task.taskId,
            title: task.title,
            importanceLevel: task.importanceLevel,
            estimatedCost: task.estimatedCost,
            description: task.description,
            assignedUsersId: task.assignedUsersId
        }
    });
}

function updateSubtask(subTask) {
    vscode.postMessage({
        command: "updateSubTask",
        params: {
            projectId: task.projectId,
            taskId: task.taskId,
            subTask
        }
    });
}

function addAssignedUser(userId) {
    vscode.postMessage({
        command: "addAssignedUser",
        params: {
            projectId: task.projectId,
            taskId: task.taskId,
            userId,
            stageId: task.stageId
        }
    });
}


function deleteAssignedUserMessage(userId) {
    vscode.postMessage({
        command: "deleteAssignedUser",
        params: {
            projectId: task.projectId,
            taskId: task.taskId,
            userId,
            stageId: task.stageId
        }
    });
}

function assignUser(e) {
    let id = e.target.value;
    task.assignedUsersId.push(id);
    let select = document.getElementById('selectAssignedUser');
    let user = document.createElement('span');
    user.classList.add('user');
    user.dataset.userid = id;
    let username = document.createElement('span');
    let userObj = allUsers.find(x => x.id === id);
    username.innerHTML = userObj.name;
    user.appendChild(username);
    let userDelete = document.createElement('span');
    userDelete.dataset.userid = id;
    userDelete.classList.add("userDelete");
    userDelete.innerHTML = "X";
    userDelete.addEventListener('click', deleteAssignedUser);
    user.appendChild(userDelete);
    let assignedUser = document.querySelector('.user-container');
    assignedUser.appendChild(user);
    select.textContent = '';
    addAssignedUser(id);
}

function deleteAssignedUser(e) {
    let id = e.target.getAttribute('data-userid');
    if (id) {
        let index = task.assignedUsersId.findIndex(x => x === id);
        if (index > -1) {
            e.currentTarget.parentNode.parentNode.remove(e.parentNode);
            task.assignedUsersId.splice(index, 1);
            deleteAssignedUserMessage(id);
        }
    }
}

function assignedNewUser() {
    const el = document.getElementById('selectAssignedUser');
    if (el.hasChildNodes()) {
        return;
    }
    const select = document.createElement('select');
    select.name = "assignUserSelect";
    let usersToAssign = allUsers.filter(x => !task.assignedUsersId.includes(x.id));
    if (usersToAssign.length < 1) {
        return;
    }
    let optionDefault = document.createElement('option');
    optionDefault.innerHTML = "Select a user to assign to this task";
    optionDefault.setAttribute("disabled", true);
    optionDefault.setAttribute("selected", true);
    select.appendChild(optionDefault);

    usersToAssign.map(x => {
        let option = document.createElement('option');
        option.innerHTML = x.name;
        option.value = x.id;
        select.appendChild(option);
    });
    select.addEventListener('change', assignUser);
    el.appendChild(select);
}

function createNewSubTask(subTask) {
    vscode.postMessage({
        command: "createNewSubTask",
        params: {
            projectId: task.projectId,
            taskId: task.taskId,
            subTask
        }
    });
}

function deleteSubtask(e) {
    let subTaskId = e.target.getAttribute('data-subTaskId');
    if (!subTaskId) { return; }
    let index = task.subtasks.findIndex(x => x.subTaskId === subTaskId);
    vscode.postMessage({
        command: "deleteSubTask",
        params: {
            projectId: task.projectId,
            taskId: task.taskId,
            subTask: task.subtasks[index]
        }
    });
    task.subtasks.splice(index, 1);
    e.target.parentElement.remove();
}


function handleEstimatedCostFromInput(e) {
    const match = e.target.value.match(/(\d+)h?(?:\s(\d+)(?:m)?)?/);
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
    } else { input.innerHTML = e.target.innerHTML; }
    if (e.target.getAttribute("data-class")) { input.setAttribute("class", e.target.getAttribute("data-class")); }
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
        if (index > -1) { task.subtasks[index].title = e.target.value; }
        newSpan.innerHTML = e.target.value.length > 0 ? e.target.value : "Not defined";
        if (e.target.getAttribute('data-subTaskId') === "0") { createNewSubTask(task.subtasks[index]); }
        else { updateSubtask(task.subtasks[index]); }
    } else {
        task[e.target.name] = e.target.value;
        newSpan.innerHTML = e.target.value.length > 0 ? e.target.value : "Not defined";
        updateTask();
    }
    let parentElement = e.target.parentElement;
    parentElement.firstElementChild.remove();
    parentElement.appendChild(newSpan);
    newSpan.addEventListener("click", spanToInput);
}


function handleIsCompleted(e) {
    let id = e.target.getAttribute("data-subTaskId");
    let index = task.subtasks.findIndex((x) => x.subTaskId === id);
    task.subtasks[index].isCompleted = e.target.checked;
    updateSubtask(task.subtasks[index]);
}

function createNewSubtaskButton() {
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
    spanDelete.innerText = "X";
    div.appendChild(spanDelete);
    document.getElementById("subtasks").prepend(div);
    input.focus();
    input.addEventListener("blur", inputToSpan);
    spanDelete.addEventListener('click', deleteSubtask);
    checkbox.addEventListener('change', handleIsCompleted);
}


document.addEventListener("DOMContentLoaded", () => {

    window.addEventListener('message', message => {
        switch (message.data.command) {
            case "createNewSubTaskResponse":
                updateNewSubtask(message.data.params.newSubTask);
        }
    });

    let switchInputs = document.querySelectorAll("span[data-switch]");
    [...switchInputs].map((span) => {
        span.addEventListener("click", spanToInput);
    });

    document.querySelector("select[name='importanceLevel']").addEventListener("change", (e) => {
        task.importanceLevel = e.target.value;
        updateTask();
    });

    let checkboxSubtasks = document.querySelectorAll(
        "input[type='checkbox']"
    );
    [...checkboxSubtasks].map((checkbox) =>
        checkbox.addEventListener("change", handleIsCompleted)
    );

    document.getElementById('addTask').addEventListener('click', createNewSubtaskButton);

    let deleteSubTasks = document.querySelectorAll("span[data-delete][data-subtaskid]");
    [...deleteSubTasks].map(x => {
        addEventListener('click', deleteSubtask);
    });

    document.getElementById('addUser').addEventListener('click', assignedNewUser);

    let deleteUserSpan = document.querySelectorAll('span.userDelete');
    if (deleteUserSpan.length > 0) {
        [...deleteUserSpan].map(x => x.addEventListener('click', deleteAssignedUser));
    }
});

