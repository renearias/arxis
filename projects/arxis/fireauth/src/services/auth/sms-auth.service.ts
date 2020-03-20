import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
// import { Pro } from '@ionic/pro';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as _ from 'lodash';
import { ArxisSmsAuthInterface } from './sms-auth.interface';
import {
  cfaSignInPhone,
  cfaSignInPhoneOnCodeSent,
  cfaSignInPhoneOnCodeReceived
} from 'capacitor-firebase-auth';
import { ArxisDeviceService } from '../device/device';
import { switchMap, take } from 'rxjs/operators';
@Injectable()
export class ArxisSmsAuthService implements ArxisSmsAuthInterface {
  constructor(
    public afAuth: AngularFireAuth,
    public platform: ArxisDeviceService
  ) {}

  verificationId: string;
  confirmationResult: any;
  recaptchaVerifier: any;

  sendSMSVerification(
    phone: any,
    verifier?: firebase.auth.RecaptchaVerifier
  ): Promise<string> {
    if (this.platform.is('android')) {
      const seq: Promise<string> = new Promise((resolve, reject) => {
        cfaSignInPhone(phone)
          .pipe(
            switchMap(() => {
              return cfaSignInPhoneOnCodeSent().pipe(take(1));
            })
          )
          .toPromise()
          .then(verificationId => {
            this.verificationId = verificationId;
            // resolve(this.verificationId);
          })
          .catch(error => {
            // TODO: Registrar eventos de error
            console.log('error', error);
            alert(
              'Ocurrio un error al verificar el numero telefonico por favor inicia sesion con tu email y contraseña'
            );
            reject(error);
          });
      });

      return seq;
    } else if (this.platform.is('ios')) {
      const seq = new Promise((resolve, reject) => {
        this.platform
          .hasPermissionNotifications()
          .then(data => {
            // this.firebasePlugin.logEvent('userHasPermissionIOS', {
            //   isEnabled: data.isEnabled || 'no data'
            // });
            console.log('data', data);
            if (data.state !== 'granted') {
              this.platform.requestPushNotifications().then(value => {
                // this.firebasePlugin.logEvent('userRequestPermissionIOS', {
                //   value
                // });
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

      return seq as Promise<any>;
    } else {
      this.recaptchaVerifier = verifier;
      const seq = this.afAuth
        .signInWithPhoneNumber(phone, this.recaptchaVerifier)
        .then(confirmationResult => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          this.confirmationResult = confirmationResult;
          this.verificationId = confirmationResult.verificationId;

          return this.verificationId;
        });

      seq.catch(error => {
        // Error; SMS not sent
        // ...
        console.error('ERROR', error);

        return error;
      });

      return seq as Promise<any>;
    }
  }

  sendSMSVerificationIOS(phone: string): Promise<string> {
    const seq: Promise<string> = new Promise((resolve, reject) => {
      cfaSignInPhone(phone)
        .pipe(
          switchMap(response => {
            console.log('response de ios', response);
            return cfaSignInPhoneOnCodeSent().pipe(take(1));
          })
        )
        .toPromise()
        .then(verificationId => {
          console.log("response de verification id")
          // change
          this.verificationId = verificationId;
          resolve(this.verificationId);
        })
        .catch(error => {
          // TODO: Logs de Eror
          console.log('error', error);
          alert(
            'Ocurrio un error al verificar el numero telefonico por favor inicia sesion con tu email y contraseña'
          );
          reject(error);
        });
    });

    return seq;
  }

  confirm(
    code: string,
    verificationId: string
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
