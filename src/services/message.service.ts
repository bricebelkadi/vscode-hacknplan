import * as vscode from "vscode";
import { StageQuickPick } from "../models/stage.model";
import { TaskTreeItem } from "../models/task.model";
import StorageService from "./storage.service";

class Message {
    constructor() {

    }

    async changeStateMessage(task: TaskTreeItem, choices: StageQuickPick[]) {
        let canPickMany = false;
        const e = await vscode.window.showQuickPick(choices, {canPickMany, placeHolder : "Choose to which stage you wanna send this task"});
        if (e) {
            StorageService.updateTaskStage(task, e.stageId);
            return e.stageId;
        }
    }
}

export const MessageService = new Message();