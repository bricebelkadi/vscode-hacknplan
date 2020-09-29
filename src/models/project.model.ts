import User from "./user.model";

export class Project {
  constructor(obj: any) {
    this.startDate = new Date(obj.startDate);
    this.dueDate = new Date(obj.dueDate);
    this.closingDate = new Date(obj.closingDate);
    this.creationDate = new Date(obj.creationDate);
    Object.assign(this, obj);
  }

  projectId!: number;
  boardId!: number;
  milestoneId!: number;
  name!: string;
  description!: string;
  generalInfo!: string;
  startDate!: Date;
  dueDate!: Date;
  closingDate!: Date;
  creationDate!: Date;
  creator!: User;
  isDefault!: boolean;
}
