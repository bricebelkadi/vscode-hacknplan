import Axios from "axios";

export default class TaskService {
  static async getAll(projectId: number) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/workitems`,
      {
        headers: {
          Authorization: `ApiKey 516cc2a8dc974d33aa0d0539b582cd89`,
        },
      }
    );
    console.log(result.data);
    return result.data;
  }
}
