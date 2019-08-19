import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserAccountInterface } from '../../interfaces/user-account.interface';
import { ArxisAuthAbstractInterface } from './auth-abstract.interface';

export abstract class ArxisAuthAbstractService
  implements ArxisAuthAbstractInterface<UserAccountInterface> {
  $user: BehaviorSubject<UserAccountInterface> = new BehaviorSubject(undefined);

  get currentUser() {
    return this.$user.value || null;
  }

  set currentUser(user) {
    this.$user.next(user);
  }
  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.currentUser != null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.currentUser.uid : '';
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any): Observable<any> | Promise<any> {
    return of({});
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any): Observable<any> | Promise<any> {
    return of({});
  }

  logout(): Observable<any> | Promise<any> {
    return of({});
  }
}
