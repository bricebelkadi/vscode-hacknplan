import Axios from "axios";
import * as vscode from "vscode";
import { Board, BoardTreeItem } from "../models/board.model";

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
}
