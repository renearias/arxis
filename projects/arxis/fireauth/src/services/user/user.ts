import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { Pro } from '@ionic/pro';
import { Account } from '../../models';
import { UserAccountInterface } from '../../interfaces/user-account.interface';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserDevices } from './userDevices';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable({
  providedIn: 'root'
})
export class ArxisUser extends UserDevices {
  _user: UserAccountInterface;
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  confirmationResult: any;
  preSavedAccountInfo: any;
  authState: Observable<any>;
  verificationId: any;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public firebasePlugin: Firebase,
    public platform: Platform
  ) {
    super(db, firebasePlugin, platform);
    this.setAuthState();
    this.initUser();
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this._user != null;
  }

  // Returns current user
  get currentUser(): any {
    return this.authenticated ? this._user : null;
  }
  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this._user.uid : '';
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any, mode?: any) {
    const seq = this.afAuth.auth
      .signInWithEmailAndPassword(accountInfo.email, accountInfo.password)
      .then((res: firebase.auth.UserCredential) => {
        return res.user;
      });

    seq
      .then(res => {
        this._loggedIn(res);
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
        // return newUser;
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

  sendSMSVerification(
    phone: any,
    verifier?: firebase.auth.RecaptchaVerifier
  ): Promise<any> {
    if (this.platform.is('cordova') && this.platform.is('android')) {
      const seq = new Promise((resolve, reject) => {
        this.firebasePlugin
          .verifyPhoneNumber(phone, 60)
          .then(credential => {
            this.verificationId = credential.verificationId;
            resolve(this.verificationId);
          })
          .catch(error => {
            Pro.getApp().monitoring.log(
              'verifyPhoneNumberFailed',
              { level: 'error' },
              error
            );
            this.firebasePlugin.logEvent('verifyPhoneNumberFailed', {
              phone: phone,
              deviceType: 'android',
              error: error
            });
            this.firebasePlugin.logError('verifyPhoneNumberFailed');
            alert(
              'Ocurrio un error al verificar el numero telefonico por favor inicia sesion con tu email y contraseña'
            );
            reject(error);
          });
      });

      return seq;
    } else if (this.platform.is('cordova') && this.platform.is('ios')) {
      const seq = new Promise((resolve, reject) => {
        this.firebasePlugin
          .hasPermission()
          .then(data => {
            this.firebasePlugin.logEvent('userHasPermissionIOS', {
              isEnabled: data.isEnabled || 'no data'
            });
            if (!data.isEnabled) {
              this.firebasePlugin.grantPermission().then(value => {
                this.firebasePlugin.logEvent('userRequestPermissionIOS', {
                  value: value
                });
                this.sendSMSVerificationIOS(phone)
                  .then(verificationId => {
                    resolve(verificationId);
                  })
                  .catch(error => {
                    reject(error);
                  });
              });
            } else {
              this.sendSMSVerificationIOS(phone)
                .then(verificationId => {
                  resolve(verificationId);
                })
                .catch(error => {
                  reject(error);
                });
            }
          })
          .catch(error => {
            reject(error);
          });
      });

      return seq;
    } else {
      this.recaptchaVerifier = verifier;
      const seq = this.afAuth.auth.signInWithPhoneNumber(
        phone,
        this.recaptchaVerifier
      );

      seq
        .then(confirmationResult => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          this.confirmationResult = confirmationResult;
          this.verificationId = confirmationResult.verificationId;
          console.log(confirmationResult);

          return confirmationResult;
        })
        .catch(error => {
          // Error; SMS not sent
          // ...
          console.error('ERROR', error);

          return error;
        });

      return seq;
    }
  }

  sendSMSVerificationIOS(phone: string) {
    const seq = new Promise((resolve, reject) => {
      this.firebasePlugin
        // .getVerificationID(phone)
        .verifyPhoneNumber(phone)
        .then(verificationId => {
          // change
          this.verificationId = verificationId;
          resolve(this.verificationId);
        })
        .catch(error => {
          Pro.getApp().monitoring.log(
            'verifyPhoneNumberFailed',
            { level: 'error' },
            error.message
          );
          this.firebasePlugin.logEvent('verifyPhoneNumberFailed', {
            phone: phone,
            deviceType: 'ios',
            errorCode: error.code || 'no code',
            error: error.message || 'no message'
          });
          this.firebasePlugin.logError('verifyPhoneNumberFailed');
          alert(
            'Ocurrio un error al verificar el numero telefonico por favor inicia sesion con tu email y contraseña'
          );
          reject(error);
        });
    });

    return seq;
  }

  confirm(code): Promise<any> {
    const confirmed = new Promise((resolve, reject) => {
      if (!code) {
        reject(new Error('Parece que te olvidaste de escribir el código'));
      }
      if (!this.verificationId) {
        reject(new Error('Ups!'));
      }
      const phoneCredential = firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        code
      );
      const seq = this.signup(this.preSavedAccountInfo);
      seq
        .then((newUser: UserAccountInterface) => {
          const link = newUser.linkWithCredential(phoneCredential);
          link
            .then(res => {
              if (this.preSavedAccountInfo) {
                this.updateUserData(this.preSavedAccountInfo, newUser);
              }
              resolve(newUser);
            })
            .catch(error => {
              // User couldn't link (bad verification code?)
              this.closeSubscriptions();
              newUser.delete().then(() => { });
              reject(error);
            });
        })
        .catch(error => {
          // User couldn't sign up
          // ...
          reject(error);
        });
    });

    return confirmed;
  }

  private updateUserData(accountInfo, newUser?: UserAccountInterface): void {
    // let path = `users/${this.currentUserId}`; // Endpoint on firebase
    if (newUser) {
      this._user = newUser;
    }
    const data = accountInfo;
    if (!this.preSavedAccountInfo) {
      this.updateProfile(data).catch(error =>
        console.log('error al actualizar update profile')
      );
    } else {
      this.updateDisplayName(data.name);
    }
    const userDoc = this.db.collection('users').doc(this.currentUserId);
    userDoc
      .set(data)
      .then(() => {
        this.preSavedAccountInfo = null;
      })
      .catch(error => console.log('error al actualizar userData', error));
  }

  /**
   * Log the user out, which forgets the session
   */
  logout(): any {
    const logout = this.afAuth.auth.signOut();
    this.afAuth.auth
      .signOut()
      .then(() => {
        this.emptyUserData();
        // this.readyState.next(false);
      })
      .catch(error => {
        // An error happened.
        console.log(error.message);
      });
    this.firebasePlugin.unregister();

    return logout;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp; // res.user en code movil
  }

  displayName(): any {
    if (this.authenticated) {
      if (this._user.displayName) {
        return this._user.displayName;
      } else if (this._user) {
        return this._user.name;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  get photoURL(): any {
    if (this.authenticated) {
      if (this._user.photoURL) {
        return this._user.photoURL || null;
      } else if (this._user) {
        return this._user.photoURL || this._user.profilePic || null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  updateProfile(data: Account): Promise<any> {
    // this.updatePhoneNumber(data.phone);
    this.userFireStoreDoc.update(data).then(res => {
      console.log('updated on firebase');
    });
    if (data.email && data.email !== this._user.email) {
      this.updateEmail(data.email);
    }
    if (data.password) {
      return this.updatePassword(data.password).then(res => {
        this.login(data);

        return this._user.updateProfile({
          displayName: data.name,
          photoURL: data.profilePic
        });
      });
    }

    return this._user.updateProfile({
      displayName: data.name,
      photoURL: data.profilePic
    });
  }

  updateDisplayName(name: string) {
    return this._user.updateProfile({
      displayName: name,
      photoURL: this._user.photoURL
    });
  }

  updateEmail(email: string) {
    return this._user.updateEmail(email);
  }

  updatePassword(password: string) {
    return this._user.updatePassword(password);
  }

  updatePhoneNumber(phone) {
    // let credential = firebase.auth.PhoneAuthProvider.credential(this.confirmationResult.verificationId, code);
    // return this._user.updatePhoneNumber(credential);
  }

  get myPendingOrdersCount(): any {
    console.log('myPendingOrdersCount');
    if (this.authenticated) {
      let total_count = 0;
      this.userFireStoreShards.forEach(doc => {
        total_count += doc['pendingOrders'];
      });

      return total_count;
    } else {
      return 0;
    }
  }

  get myActiveSalesCount(): any {
    if (this.authenticated && this.primaryBusiness) {
      return this.primaryBusiness.pendingOrders || 0;
    } else {
      return 0;
    }
  }

  setAuthState(): any {
    this.authState = this.afAuth.authState.pipe(
      switchMap((user: firebase.User) => {
        if (user) {
          this.userFireStoreDoc = this.db.doc('users/' + user.uid);

          return this.userFireStoreDoc.valueChanges().pipe(
            map((account: Account) => {
              return _.extend(user, account);
            })
          );
        } else {
          /// not signed in
          return of(null);
        }
      })
    );
  }

  initUser() {
    return this.authState.subscribe(
      (user: UserAccountInterface) => {
        if (user) {
          this._user = user;
          if (this.authenticated) {
            this.fillUserData(this.currentUserId);
          }
          this.updateReadyState();
        }
      },
      error => {
        console.log('ocurrioun erooor', error);
      }
    );
  }

  isReadyData() {
    if (!this.authenticated) {
      return false;
    }

    return super.isReadyData();
  }
}
