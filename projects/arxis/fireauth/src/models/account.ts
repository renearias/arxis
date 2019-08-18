import { AbstractModel } from './abstract-model';
import { Roles } from '../interfaces/roles';
export class Account extends AbstractModel {
  uid?: string;
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  phone: string;
  type: string;
  roles?: Roles;
}
