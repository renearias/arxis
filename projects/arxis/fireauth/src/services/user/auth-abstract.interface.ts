import { BehaviorSubject, Observable } from 'rxjs';

export interface ArxisAuthAbstractInterface<T> {
  $user: BehaviorSubject<T>;

  currentUser: T;
  // Returns true if user is logged in
  authenticated: boolean;
  // Returns current user UID
  currentUserId: string;

  login(credentials: {
    email: string;
    password: string;
    [key: string]: any;
  }): Observable<any> | Promise<any>;
  logout(): Observable<any> | Promise<any>;
  signup(credentials: {
    email: string;
    password: string;
    [key: string]: any;
  }): Observable<any> | Promise<any>;
}
