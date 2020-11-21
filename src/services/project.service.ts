import Axios from 'axios';
import * as vscode from 'vscode';

import { Project, ProjectTreeItem } from '../models/project.model';

export default class ProjectService {
  static async getAll() {
    const result = await Axios.get("https://api.hacknplan.com/v0/projects");
    return result.data;
  }

  static async generateProjectTreeItems () {
    const result = await this.getAll();
    const projectTreeItems = result.map((pro: Project) => {
      let projectTreeItem = new ProjectTreeItem(
        pro.name,
        vscode.TreeItemCollapsibleState.Expanded,
        pro.id
      );
      let projectTreeItemCommand: vscode.Command = {
        title: "Define Current Project",
        command: "hacknplan.currentProject",
        arguments: [pro.id]
      };
      projectTreeItem.command = projectTreeItemCommand;
      return projectTreeItem;
    });
    return projectTreeItems;
  }
}
