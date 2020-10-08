/* eslint-disable @typescript-eslint/naming-convention */

import { Stage } from "../models/stage.model";

interface IAllStages {
  projectId: number;
  stages: Stage[];
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
}

const StorageService = new StorageSingleton();
Object.freeze(StorageService);

export default StorageService;
