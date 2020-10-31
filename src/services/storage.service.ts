/* eslint-disable @typescript-eslint/naming-convention */

import { ITaskTree } from "../models/core.model";
import ImportanceLevel from "../models/importanceLevel.model";
import { Stage, StageTreeItem } from "../models/stage.model";
import { TaskTreeItem } from "../models/task.model";

interface IAllStages {
  projectId: number;
  stages: Stage[];
}

interface IAllImportanceLevel {
  projectId: number;
  importanceLevel: ImportanceLevel[];
}

interface ICurrentProjectId {
  currentProjectId: number;
}

interface ICurrentBoardId {
  currentBoardId: number;
}


class StorageSingleton {
  // All Stages
  allStages: IAllStages[] = [];

  addToAllStages(obj: IAllStages) {
    let index = this.allStages.findIndex((x : IAllStages) => x.projectId === obj.projectId);
    if (index > -1) {
      this.allImportanceLevels.splice(index, 1);
      return this.allStages.push(obj);
    } else {
      return this.allStages.push(obj);
    }
  }

  getAllStages(projectId: number) {
    const result = this.allStages.find(
      (x: IAllStages) => x.projectId === projectId
    );
    if (result === undefined) {
      return [];
    } else {
      return result?.stages;
    }
  }

  // All Importance Levels
  allImportanceLevels: IAllImportanceLevel[] = [];

  addToAllImportanceLevel(obj: IAllImportanceLevel) {
    let index = this.allImportanceLevels.findIndex((x : IAllImportanceLevel) => x.projectId === obj.projectId);
    if (index > -1) {
      this.allImportanceLevels.splice(index, 1);
      return this.allImportanceLevels.push(obj);
    } else {
      return this.allImportanceLevels.push(obj);
    }
  }

  getAllImportanceLevel(projectId: number) {
    const result = this.allImportanceLevels.find(
      (x: IAllImportanceLevel) => x.projectId === projectId
    );
    if (result === undefined) {
      return [];
    } else {
      return result?.importanceLevel;
    }
  }

  // Current Project Id
  projectId: ICurrentProjectId[] = [];

  getProjectId() {
    if (this.projectId[0].currentProjectId) {
      return this.projectId[0].currentProjectId;
    } else {
      return null;
    }
  }

  storeProjectId(projectId: number) {
    let projectIdObj: ICurrentProjectId = {
      currentProjectId: projectId,
    };
    if (this.projectId.length === 0) {
      this.projectId.push(projectIdObj);
    } else {
      this.projectId.pop();
      this.projectId.push(projectIdObj);
    }
  }

  eraseProjectId() {
    this.projectId.splice(0, this.projectId.length);
  }

  // Current Board Id
  boardId: ICurrentBoardId[] = [];

  getBoardId() {
    if (this.boardId[0].currentBoardId) {
      return this.boardId[0].currentBoardId;
    } else {
      return null;
    }
  }

  storeBoardId(boardId: number) {
    let boardIdObj: ICurrentBoardId = {
      currentBoardId: boardId,
    };
    if (this.boardId.length === 0) {
      this.boardId.push(boardIdObj);
    } else {
      this.boardId.pop();
      this.boardId.push(boardIdObj);
    }
  }

  eraseBoardId() {
    this.boardId.splice(0, this.boardId.length);
  }


  taskTree : ITaskTree[] = [];
  
  updateTaskTree (taskTree: ITaskTree[]) {
    taskTree.map(x => this.taskTree.push(x));
  }

  updateStageInTaskTree(stageId: number, obj: TaskTreeItem[]) {
    const index = this.taskTree.findIndex(x => x.stage.stageId === stageId);
    if (index > -1) {
      this.taskTree[index].tasks = obj;
    } else {
      console.log("Stage not founded, sorry");
    }
  }

  getTaskTreeStages() {
    const allStages = this.taskTree.map(x => x.stage);
    return allStages;
  }

  getTaskTreeTasks(stageId: number) {
    const stage = this.taskTree.find(x => x.stage.stageId === stageId);
    if (stage) {
      return stage.tasks;
    } else {
      return [];
    }
  }

  updateCollapseState(stageId: number, state: boolean) {
    let index = this.taskTree.findIndex(x => x.stage.stageId === stageId);
    if (index > -1) {
      let old = this.taskTree[index].stage;
      let newTaskItem: ITaskTree = {
        isOpened: state,
        stage: old,
        tasks : this.taskTree[index].tasks
      };
      this.taskTree.splice(index, 1, newTaskItem);
    }
  }

  resetTaskTree() {
    this.taskTree.splice(0, this.taskTree.length-1);
  }
}

const StorageService = new StorageSingleton();
Object.freeze(StorageService);

export default StorageService;
