import Axios, { AxiosRequestConfig } from "axios";
import * as vscode from "vscode";
import { StageQuickPick } from "../models/stage.model";
import { TaskTreeItem } from "../models/task.model";
import { MainTreeContainer } from "../views/tree/main.tree";
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

    async defineAPIKeyMessage() {
        const e = await vscode.window.showInputBox({placeHolder: "Please enter your HackNPlan API key here", ignoreFocusOut: true});
        if (e && e?.length > 0) {
            Axios.interceptors.request.use((config: AxiosRequestConfig) => {
                config.headers.Authorization = `ApiKey ${e}`;
                return config;
              });
            await vscode.workspace.getConfiguration('hacknplan').update('apiKey', e, vscode.ConfigurationTarget.Global);
          
            MainTreeContainer.projectTreeProvider.refresh();
        }
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MessageService = new Message();