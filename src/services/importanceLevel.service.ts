import Axios from "axios";
import ImportanceLevel from "../models/importanceLevel.model";
import StorageService from "./storage.service";

export default class ImportanceLevelService {
  static async getAll(projectId: number) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/importancelevels`
    );
    return result.data as ImportanceLevel[];
  }

  static async getAndStore(projectId: number, reset?: boolean) {
    const currentImportanceLevel = StorageService.getAllImportanceLevel(
      projectId
    );
    if (!reset && currentImportanceLevel.length > 0) {
      return;
    } else {
      const result = await this.getAll(projectId);
      return StorageService.addToAllImportanceLevel({
        projectId,
        importanceLevel: result,
      });
    }
  }
}
