import Axios from "axios";
import { Stage, StageTreeItem } from "../models/stage.model";
import * as vscode from "vscode";
import StorageService from "./storage.service";

export default class StageService {
  static async getAll(projectId: number) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/stages`,
      {
        headers: {
          Authorization: `ApiKey 516cc2a8dc974d33aa0d0539b582cd89`,
        },
      }
    );
    return result.data;
  }

  static async generateStageTreeItems(stages: Stage[], boardId: number) {
    const stageTreeItems = stages.map((stage: Stage) => {
      return new StageTreeItem(
        stage.name,
        vscode.TreeItemCollapsibleState.Expanded,
        "Stage",
        boardId,
        stage.projectId,
        stage.stageId
      );
    });
    return stageTreeItems;
  }

  static async storeStages(projectId: number) {
    const result = await this.getAll(projectId);
    StorageService.addToAllStages({ projectId: projectId, stages: result });
  }
}
