import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
// import { Pro } from '@ionic/pro';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as _ from 'lodash';

import { ArxisSmsAuthInterface } from './sms-auth.interface';

/**
 * @deprecated
 */
@Injectable()
export class ArxisSmsCordovaAuthService implements ArxisSmsAuthInterface {
  constructor(
    public afAuth: AngularFireAuth,
    public firebasePlugin: FirebaseX,
    public platform: Platform
  ) {}

  verificationId: string | undefined;
  confirmationResult: any;
  recaptchaVerifier: any;

  sendSMSVerification(
    phone: any,
    verifier?: firebase.auth.RecaptchaVerifier
  ): Promise<string> {
    let awaitingSms = false;
    if (this.platform.is('cordova') && this.platform.is('android')) {
      const seq = new Promise((resolve, reject) => {
        this.firebasePlugin
          .verifyPhoneNumber(
            (credential: any) => {
              if (credential.instantVerification) {
                if (awaitingSms) {
                  awaitingSms = false;
                  // the Android device used auto-retrieval to extract and submit the verification code in the SMS so dismiss user input UI
                  // dismissUserPromptToInputCode();
                }
                // signInWithCredential(credential);
              } else {
                awaitingSms = true;
                // promptUserToInputCode() // you need to implement this
                // .then(function(userEnteredCode) {
                //   awaitingSms = false;
                //   credential.code = userEnteredCode; // set the user-entered verification code on the credential object
                //   signInWithCredential(credential);
                // });
              }
            },
            (error) => {
              console.error(
                'Failed to verify phone number: ' + JSON.stringify(error)
              );
            },
            phone,
            60
          )
          .then((credential) => {
            this.verificationId = credential.verificationId;
            resolve(this.verificationId);
          })
          .catch((error) => {
            // Pro.getApp().monitoring.log(
            //   'verifyPhoneNumberFailed',
            //   { level: 'error' },
            //   error
            // );
            this.firebasePlugin.logEvent('verifyPhoneNumberFailed', {
              phone,
              deviceType: 'android',
              error,
            });
            this.firebasePlugin.logError('verifyPhoneNumberFailed');
            alert(
              'Ocurrio un error al verificar el numero telefonico por favor inicia sesion con tu email y contraseña'
            );
            reject(error);
          });
      });

      return seq as Promise<any>;
    } else if (this.platform.is('cordova') && this.platform.is('ios')) {
      const seq = new Promise((resolve, reject) => {
        this.firebasePlugin
          .hasPermission()
          .then((isEnabled) => {
            this.firebasePlugin.logEvent('userHasPermissionIOS', {
              isEnabled: isEnabled || 'no data',
            });
            if (!isEnabled) {
              this.firebasePlugin.grantPermission().then((value) => {
                this.firebasePlugin.logEvent('userRequestPermissionIOS', {
                  value,
                });
                this.sendSMSVerificationIOS(phone)
                  .then((verificationId) => {
                    resolve(verificationId);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              });
            } else {
              this.sendSMSVerificationIOS(phone)
                .then((verificationId) => {
                  resolve(verificationId);
                })
                .catch((error) => {
                  reject(error);
                });
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

      return seq as Promise<any>;
    } else {
      this.recaptchaVerifier = verifier;
      const seq = this.afAuth
        .signInWithPhoneNumber(phone, this.recaptchaVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          this.confirmationResult = confirmationResult;
          this.verificationId = confirmationResult.verificationId;

          return this.verificationId;
        });

      seq.catch((error) => {
        // Error; SMS not sent
        // ...
        console.error('ERROR', error);

        return error;
      });

      return seq as Promise<any>;
    }
  }

  sendSMSVerificationIOS(phone: string): Promise<string> {
    let awaitingSms = false;
    const seq = new Promise((resolve, reject) => {
      this.firebasePlugin
        // .getVerificationID(phone)
        .verifyPhoneNumber(
          (credential: any) => {
            if (credential.instantVerification) {
              if (awaitingSms) {
                awaitingSms = false;
                // the Android device used auto-retrieval to extract and submit the verification code in the SMS so dismiss user input UI
                // dismissUserPromptToInputCode();
              }
              // signInWithCredential(credential);
            } else {
              awaitingSms = true;
              // promptUserToInputCode() // you need to implement this
              // .then(function(userEnteredCode) {
              //   awaitingSms = false;
              //   credential.code = userEnteredCode; // set the user-entered verification code on the credential object
              //   signInWithCredential(credential);
              // });
            }
          },
          (error) => {
            console.error(
              'Failed to verify phone number: ' + JSON.stringify(error)
            );
          },
          phone
        )
        .then((verificationId) => {
          // change
          this.verificationId = verificationId;
          resolve(this.verificationId);
        })
        .catch((error) => {
          // Pro.getApp().monitoring.log(
          //   'verifyPhoneNumberFailed',
          //   { level: 'error' },
          //   error.message
          // );
          this.firebasePlugin.logEvent('verifyPhoneNumberFailed', {
            phone,
            deviceType: 'ios',
            errorCode: error.code || 'no code',
            error: error.message || 'no message',
          });
          this.firebasePlugin.logError('verifyPhoneNumberFailed');
          alert(
            'Ocurrio un error al verificar el numero telefonico por favor inicia sesion con tu email y contraseña'
          );
          reject(error);
        });
    });

    return seq as Promise<string>;
  }

  confirm(
    code: string,
    verificationId?: string
  ): Promise<firebase.auth.AuthCredential> {
    const confirmedPromise: Promise<firebase.auth.AuthCredential> = new Promise(
      (resolve, reject) => {
        if (!code) {
          reject(new Error('Parece que te olvidaste de escribir el código'));
        }
        if (!verificationId) {
          verificationId = this.verificationId;
        }
        if (!verificationId) {
          reject(new Error('Ups!'));
          return;
        }
        const phoneCredential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          code
        );

        resolve(phoneCredential);
      }
    );

    return confirmedPromise;
  }
}
