import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserAccountInterface } from '../../interfaces/user-account.interface';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ArxisAuthAbstractService } from './auth-abstract.service';
import { CapacitorFirebaseAuthPlugin, cfaSignInFacebook, cfaSignOut, FacebookSignInResult } from 'capacitor-firebase-auth/alternative';
import { Plugins } from '@capacitor/core';
import { IProviderUserData } from '../../interfaces';
import ProviderAuthException from '../../exceptions/provider-auth-exception';

@Injectable({
  providedIn: 'root'
})
export class ArxisFireAuthService extends ArxisAuthAbstractService {
  authState: Observable<any>;

  constructor(public afAuth: AngularFireAuth) {
    // super(db, firebasePlugin, platform);
    super();
    this.setAuthState();
    this.initUser();
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    const seq = this.afAuth
      .signInWithEmailAndPassword(accountInfo.email, accountInfo.password)
      .then((res: firebase.auth.UserCredential) => {
        return res.user;
      });

    seq
      .then(res => {
        this._loggedIn(res);
        return this.currentUser;
      })
      .catch(error => {
        console.error('ERROR EN LOGIN', error);
      });

    return seq;
  }

  loginWithCredential(
    credential: firebase.auth.AuthCredential
  ): Promise<firebase.auth.UserCredential> {
    const promise: Promise<
      firebase.auth.UserCredential
    > = this.afAuth
      .signInWithCredential(credential)
      .then((userCredential: firebase.auth.UserCredential) => {
        return userCredential;
      });
    return promise;
  }

  /**
   *
   * @deprecated loginWithFacebook()
   */
  loginFB() {
    const provider = new firebase.auth.FacebookAuthProvider();

    return this.afAuth
      .signInWithPopup(provider)
      .then(credential => {
        return credential;
      })
      .catch(error => {
        throw error;
      });
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    const seq = this.afAuth
      .createUserWithEmailAndPassword(accountInfo.email, accountInfo.password)
      .then((res: firebase.auth.UserCredential) => {
        return res.user;
      });
    seq
      .then(newUser => {
        // this.preSavedAccountInfo=accountInfo;
        this._loggedIn(newUser);
        return newUser;
      })
      .catch(error => {
        // Error; SMS not sent
        // ...
        console.error('ERROR', error);
      });

    return seq as Promise<any>;
  }

  async isValidEmailForSignUp(email: string) {
    try {
      const methods = await this.afAuth.fetchSignInMethodsForEmail(email);
      const hasPasswordMethod: boolean =
        methods.findIndex(method => {
          return method === 'password';
        }) !== -1;

      if (!hasPasswordMethod) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user has provider
   */
  hasProvider(user: firebase.User, providerId: string) {
    if (!user) {
      return false;
    }
    const index = user.providerData.findIndex((provider: firebase.UserInfo) => {
      return provider.providerId === providerId;
    });
    return index !== -1;
  }

  createEmailCredential(email: string, password: string) {
    return firebase.auth.EmailAuthProvider.credential(email, password);
  }

  linkAccount(
    credential: firebase.auth.AuthCredential
  ): Promise<firebase.auth.UserCredential> {
    if (!this.currentUser) {
      return Promise.reject({ code: 'user-no-auth', message: 'user-no-auth' });
    }
    return this.currentUser.linkWithCredential(credential);
  }

  updateDisplayName(name: string) {
    return this.currentUser.updateProfile({
      displayName: name,
      photoURL: this.currentUser.photoURL
    });
  }

  updateEmail(email: string) {
    return this.currentUser.updateEmail(email);
  }

  updatePassword(password: string) {
    return this.currentUser.updatePassword(password);
  }

  /**
   * Log the user out, which forgets the session
   */
  logout(): Promise<void> {
    const logout = this.afAuth.signOut();
    logout
      .then(() => {
        // this.emptyUserData();
        // this.readyState.next(false);
        this.currentUser = undefined;
      })
      .catch(error => {
        // An error happened.
        console.log(error.message);
      });
    // this.firebasePlugin.unregister();

    return logout;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this.currentUser = resp; // res.user en code movil
  }

  setAuthState() {
    this.authState = this.afAuth.authState;
  }

  initUser() {
    return this.authState.subscribe(
      (user: UserAccountInterface) => {
        if (user) {
          this._loggedIn(user);
        }
      },
      error => {
        console.log('ocurrioun erooor', error);
      }
    );
  }




  /**
   * Intenta iniciar sesión con Facebook. Si no está registrado, obtiene la credential para proceder a enlazarlo.
   *
   * @param allowNew Indica si se mantiene la cuenta con sólo Facebook. Si es falso, retornará las credenciales y datos
   *  para crear la cuenta y enlazar Facebook luego.
   *
   * @throws ProviderAuthException
   */
  async loginWithFacebook(allowNew = false) {
    try {
      const { result, userCredential } = await cfaSignInFacebook().toPromise();
      const user = userCredential.user;

      if (!allowNew && !this.hasProvider(user, 'password')) { // Comprobar si cuenta ha sido creada
        const data: IProviderUserData = {
          email: user.email || undefined,
          name: user.displayName || undefined,
          phone: user.phoneNumber || undefined,
        };

        await cfaSignOut().toPromise();

        await user.delete();

        throw new ProviderAuthException(
          'auth/unregistered',
          `Usuario de Facebook aún no registrado: ${user.email}.`,
          data,
          result
        );
      }

      return user;
    } catch (err) {
      if (err instanceof ProviderAuthException) {
        throw err;
      }

      const { oauthAccessToken, message, email } = JSON.parse(JSON.stringify(err)) as { [i: string]: string | undefined};

      throw new ProviderAuthException(
        err.code,
        message,
        {
          email
        },
        oauthAccessToken ? new FacebookSignInResult(oauthAccessToken) : undefined,
        err
      );
    }
  }
}
