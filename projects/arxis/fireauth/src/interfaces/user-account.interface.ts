import { Roles } from './roles';
import * as firebase from 'firebase/app';
export interface UserAccountInterface extends firebase.User {
    uid: string;
    name: string;
    email: string;
    password: string;
    profilePic?: string;
    phone: string;
    type: string;
    roles?: Roles;
}
