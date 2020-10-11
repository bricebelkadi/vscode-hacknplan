/* eslint-disable @typescript-eslint/naming-convention */

import ImportanceLevel from "../models/importanceLevel.model";
import { Stage } from "../models/stage.model";

interface IAllStages {
  projectId: number;
  stages: Stage[];
}

interface IAllImportanceLevel {
  projectId: number;
  importanceLevel: ImportanceLevel[];
}


class StorageSingleton {
  allStages: IAllStages[] = [];

  addToAllStages(obj: IAllStages) {
    this.allStages.push(obj);
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

  allImportanceLevels: IAllImportanceLevel[] = [];

  addToAllImportanceLevel(obj: IAllImportanceLevel) {
    this.allImportanceLevels.push(obj);
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

}

const StorageService = new StorageSingleton();
Object.freeze(StorageService);

export default StorageService;
