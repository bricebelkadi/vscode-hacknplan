import Axios from "axios";
import User from "../models/user.model";
import StorageService from "./storage.service";

export class UserService {
    static async getAllUser(projectId: number) {
        const result = await Axios.get(
            `https://api.hacknplan.com/v0/projects/${projectId}/users`
        );
        return result.data;
    }

    static async getAndStore(projectId : number) {
        const users = await this.getAllUser(projectId);
        return StorageService.storeUsers({projectId, users});
    }

    static async getAndStoreMe() {
        const result = await Axios.get(
            `https://api.hacknplan.com/v0/users/me`
        );
        result.data as User;
        return StorageService.storeMe(result.data);

    }
}

//"default": "516cc2a8dc974d33aa0d0539b582cd89",
