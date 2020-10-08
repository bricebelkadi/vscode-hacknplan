export default class User {
  constructor(obj: any) {
    this.creationDate = new Date(obj.creationDate);
    Object.assign(this, obj);
  }

  id!: number;
  username!: string;
  email?: string;
  name!: string;
  creationDate?: Date;
}
