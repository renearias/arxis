import { auth } from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';

import { UserRegistrationStatus } from '../../declarations';
import { UserAccountInterface } from '../../interfaces/user-account.interface';

import { ArxisAuthAbstractInterface } from './auth-abstract.interface';

export abstract class ArxisAuthAbstractService
  implements ArxisAuthAbstractInterface<UserAccountInterface> {
  $user: BehaviorSubject<UserAccountInterface | null> = new BehaviorSubject<UserAccountInterface | null>(
    null
  );

  // tslint:disable-next-line:variable-name
  private _registrationStatus$: BehaviorSubject<UserRegistrationStatus | null> = new BehaviorSubject<UserRegistrationStatus | null>(
    null
  );

  /**
   * @see registrationStatus
   */
  get registrationStatus$() {
    return this._registrationStatus$;
  }

  /**
   * Obtiene el estado del registro del usuario autenticado.
   */
  get registrationStatus(): UserRegistrationStatus | null {
    return this.registrationStatus$.value;
  }

  /**
   * Obtiene o establece el usuario autenticado actual.
   */
  get currentUser(): UserAccountInterface | null {
    return this.$user.value;
  }

  set currentUser(user: UserAccountInterface | null) {
    this.$user.next(user);

    this.syncRegistrationStatus(); // Actualización asincrónica del registrationStatus$
  }

  /**
   * Establece el `registrationStatus` (`registrationStatus$`) según el estado del usuario actual.
   */
  async syncRegistrationStatus() {
    const user = this.currentUser;

    if (!user) {
      console.log(this.constructor.name, null); // 🚧 DEBUG
      this.registrationStatus$.next(null);
      return;
    }

    const status = new UserRegistrationStatus({
      email: !!user.email,
      name: !!user.displayName,
      verifiedEmail: user.emailVerified,
      phone: !!user.phoneNumber,
      password: !user.email ? false : undefined, // ⚡ Si no tiene correo, entonces sabemos que no tiene contraseña
    });

    console.log(this.constructor.name, status); // 🚧 DEBUG

    this.registrationStatus$.next(status);

    if (user.email) {
      // Si tiene correo entonces se consulta si posee contraseña y emite un nuevo valor con la password definida (true|false)
      const methods = await auth().fetchSignInMethodsForEmail(user.email);

      const password = methods.includes(
        auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
      );

      status.password = password;

      console.log(this.constructor.name, status); // 🚧 DEBUG
      this.registrationStatus$.next(status);
    }
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
