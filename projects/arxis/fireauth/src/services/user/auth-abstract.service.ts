import { BehaviorSubject, Observable } from 'rxjs';
import { UserAccountInterface } from '../../interfaces/user-account.interface';
import { ArxisAuthAbstractInterface } from './auth-abstract.interface';

export abstract class ArxisAuthAbstractService
  implements ArxisAuthAbstractInterface<UserAccountInterface> {
  $user: BehaviorSubject<UserAccountInterface | null> = new BehaviorSubject<UserAccountInterface | null>(
    null
  );

  get currentUser() {
    return this.$user.value;
  }

  set currentUser(user) {
    this.$user.next(user);
  }
  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.currentUser?.uid ?? '';
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  abstract login<TInfo extends { email: string; password: string }>(
    credentials: TInfo
  ): Promise<UserAccountInterface>;

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  abstract signup<TInfo extends { email: string; password: string }>(
    accountInfo: TInfo
  ): Observable<any> | Promise<any>;

  abstract logout(): Observable<any> | Promise<any>;
}
