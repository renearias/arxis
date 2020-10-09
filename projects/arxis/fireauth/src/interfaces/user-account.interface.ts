import { Roles } from './roles';
import { User } from 'firebase/app';

export interface UserAccountInterface extends User {
  uid: string;
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  phone: string;
  type: string;
  roles?: Roles;
}
