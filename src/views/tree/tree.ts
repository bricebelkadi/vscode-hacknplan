import * as vscode from "vscode";
import * as path from "path";
import ProjectService from "../../services/project.service";
import { Project } from "../../models/project.model";
import TaskService from "../../services/task.service";

export class Projectprovider implements vscode.TreeDataProvider<ProjectItem> {
  constructor() {}

  getTreeItem(element: any): vscode.TreeItem {
    return element;
  }

  getChildren(element?: any): Thenable<any[]> {
    console.log(this.getProjects());
    return Promise.resolve(this.getProjects());
  }

  async getProjects() {
    const array = await ProjectService.getAll();
    const result = array.map((pro: Project) => {
       const tasks = this.getTasks(pro.projectId);
      return new ProjectItem(pro.name, vscode.TreeItemCollapsibleState.Expanded);
    });
    return result;
  }

  async getTasks(id) {
      const array = await TaskService.getAll(id);
      const result = array.map()
  }
}

class ProjectItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }
}

class TaskItems extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }
}
