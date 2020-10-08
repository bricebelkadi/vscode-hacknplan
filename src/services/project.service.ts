import Axios from "axios";
import { Project, ProjectTreeItem } from "../models/project.model";
import * as vscode from "vscode";
import StageService from "./stage.service";
import StorageService from "./storage.service";

export default class ProjectService {
  static async getAll() {
    const result = await Axios.get("https://api.hacknplan.com/v0/projects", {
      headers: {
        Authorization: `ApiKey 516cc2a8dc974d33aa0d0539b582cd89`,
      },
    });
    return result.data;
  }

  static async generateProjectTreeItems () {
    const result = await this.getAll();
    const projectTreeItems = result.map((pro: Project) => {
      return new ProjectTreeItem(
        pro.name,
        vscode.TreeItemCollapsibleState.Expanded,
        "Project",
        pro.id
      );
    });
    return projectTreeItems;
  }

  static async handleStages(projectId: number) {
    await StageService.storeStages(projectId);
  }
}
