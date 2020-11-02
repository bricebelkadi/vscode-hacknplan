import Axios from "axios";
import { Stage, StageTreeItem } from "../models/stage.model";
import * as vscode from "vscode";
import StorageService from "./storage.service";
import { ITaskTree } from "../models/core.model";


export default class StageService {
  static async getAll(projectId: number) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/stages`
    );
    return result.data as Stage[];
  }

  static async generateStageTreeItems(stages: Stage[], boardId: number) {
    const stageTreeItems = stages.map((stage: Stage) => {
      let collapseState = stage.isOpened ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed;
      return new StageTreeItem(
        stage.name,
        collapseState,
        "Stage",
        boardId,
        stage.projectId,
        stage.stageId
      );
    });
    let currentTaskTree: ITaskTree [] = [];
    stageTreeItems.map((x: StageTreeItem) => {
      let taskTree : ITaskTree = {
        stage: x,
        tasks: []
      };
      currentTaskTree.push(taskTree);
    });
    StorageService.updateTaskTree(currentTaskTree);    
    return stageTreeItems;
  }



  static async getAndStore(projectId: number, reset?: boolean) {
    const storedStages = StorageService.getAllStages(projectId);
    if (!reset && storedStages.length > 0) {
      return;
    } else {

      const result = await this.getAll(projectId);
      result.map(x => {
        if(result[0].stageId === x.stageId) {
          return x.isOpened = true;
        } else {
          return x.isOpened = false;
        }
      });
      StorageService.addToAllStages({ projectId: projectId, stages: result });
    }
  }
}
