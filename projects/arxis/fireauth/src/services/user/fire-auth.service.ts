import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserAccountInterface } from '../../interfaces/user-account.interface';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ArxisAuthAbstractService } from './auth-abstract.service';

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
    const seq = this.afAuth.auth
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

  loginFB() {
    const provider = new firebase.auth.FacebookAuthProvider();

    return this.afAuth.auth
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
    const seq = this.afAuth.auth
      .createUserWithEmailAndPassword(accountInfo.email, accountInfo.password)
      .then((res: firebase.auth.UserCredential) => {
        return res.user;
      });
    seq
      .then(newUser => {
        // this.preSavedAccountInfo=accountInfo;
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
      const res = await this.afAuth.auth.fetchSignInMethodsForEmail(email);
      if (res.length === 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
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
    const logout = this.afAuth.auth.signOut();
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
}
