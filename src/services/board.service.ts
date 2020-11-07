import Axios from "axios";
import * as vscode from "vscode";
import { Board, BoardTreeItem, MileStone, MilestoneTreeItem } from "../models/board.model";
import StorageService from "./storage.service";

export default class BoardService {
  static async getAll(projectId: number) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/boards`
    );
    return result.data;
  }

  static async generateBoardTreeItems(projectId: number) {
    const result = await this.getAll(projectId);
    const boardTreeItems = result.map((board: Board) => {
      if (board.milestoneId) {
        return;
      }
      StorageService.updateBoardTree(board);
      let boardItem = new BoardTreeItem(
        board.name,
        vscode.TreeItemCollapsibleState.Expanded,
        "Board",
        board.boardId,
        projectId
      );
      let boardTreeItemCommand: vscode.Command = {
        title: "Define Current Board",
        command: "hacknplan.currentBoard",
        arguments: [board.boardId]
      };
      boardItem.command = boardTreeItemCommand;
      return boardItem;

    });
    return boardTreeItems;
  }

  static async getAllMilestones (projectId:number) {
    const result = await Axios.get(
      `https://api.hacknplan.com/v0/projects/${projectId}/milestones?includeBoards=true`
    );
    let mileArray = result.data.map((x: any) => new MileStone(x));
    return mileArray;
  }

  static async generateMilestoneTreeItems(projectId: number) {
    const result = await this.getAllMilestones(projectId);
    const milestoneTreeItems = result.map((mile: MileStone) => {
      StorageService.updateBoardTree(mile);
      let milestoneItem = new MilestoneTreeItem(
        mile.name,
        vscode.TreeItemCollapsibleState.Collapsed,
        "Milestone",
        mile.milestoneId,
        mile.projectId);
      return milestoneItem;
    });
    const boardAlone = await this.generateBoardTreeItems(projectId);
    return [...milestoneTreeItems, ...boardAlone];
  }

  static async generateBoardFromMilestone(mileId: number) {
    let boards = StorageService.getBoardFromMilestone(mileId);
    if (boards === undefined) {
      return [];
    }
    let boardItems = boards.map((board : Board) => {
      let boardItem = new BoardTreeItem(
        board.name,
        vscode.TreeItemCollapsibleState.Expanded,
        "Board",
        board.boardId,
        board.projectId
      );
      let boardTreeItemCommand: vscode.Command = {
        title: "Define Current Board",
        command: "hacknplan.currentBoard",
        arguments: [board.boardId]
      };
      boardItem.command = boardTreeItemCommand;
      return boardItem;
    });
    return boardItems;
  }
}
