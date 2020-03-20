import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as _ from 'lodash';
import { Observable, of, from, BehaviorSubject, iif } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { ArxisFireStoreAuthService } from './firestore-auth.service';
import { Platform } from '@ionic/angular';
import { ArxisDeviceService } from '../device/device';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';

const { PushNotifications } = Plugins;

export const ROUTE_FCM_DOC = new InjectionToken<string>(
  'arxis.fireauth.ROUTE_FCM_DOC'
);

@Injectable()
export class ArxisIonicFireStoreAuthService extends ArxisFireStoreAuthService {
  userDevicesFCMDoc: AngularFirestoreDocument<any>;
  $FCMToken: BehaviorSubject<string> = undefined;

  get FCMToken() {
    return this.$FCMToken.value;
  }

  set FCMToken(token: string) {
    this.$FCMToken.next(token);
  }

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public device: ArxisDeviceService,
    public platform: Platform,
    @Inject(ROUTE_FCM_DOC)
    private routeFCMDoc: string
  ) {
    super(afAuth, afs);
    this.platformReady().subscribe(async () => {
      if ((await this.device.is('android')) || (await this.device.is('ios'))) {
        // Register with Apple / Google to receive push via APNS/FCM

        PushNotifications.register()
          .then(() => {}) // save the token server-side and use it to push notifications to this device
          .catch(error => console.error('Error getting token', error));

        PushNotifications.addListener(
          'registration',
          (token: PushNotificationToken) => {
            this.FCMToken = token.value;
            try {
              this.registerFCMToken();
            } catch (e) {
              console.log('Error updating token', e);
            }
          }
        );
      }
    });
  }

  setAuthState(): any {
    this.authState = this.afAuth.authState.pipe(
      switchMap(this.authFillAction.bind(this))
    );
  }

  platformReady(user?: firebase.User) {
    return from(this.platform.ready()).pipe(
      switchMap(platform => {
        return of(user);
      })
    );
  }

  authFillAction(user: firebase.User): Observable<any> {
    return super.authFillAction(user).pipe(
      switchMap(this.platformReady.bind(this)),
      switchMap(u => {
        if (u) {
          this.userDevicesFCMDoc = this.userFireStoreDoc
            .collection('devices')
            .doc(this.routeFCMDoc || 'FCM');
          return of(u).pipe(
            switchMap(async us => {
              if (
                (await this.device.is('android')) ||
                (await this.device.is('ios'))
              ) {
                return from(this.$FCMToken).pipe(
                  switchMap(this.registerFCMToken.bind(this)),
                  switchMap(() => {
                    return of(us);
                  })
                );
              } else {
                return of(us);
              }
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  registerFCMToken(token?: string) {
    return this.userDevicesFCMDoc.valueChanges().pipe(
      map(res => {
        let devicesFCM: Array<string>;
        if (res) {
          devicesFCM = res.devices || [];
        } else {
          devicesFCM = [];
        }
        const newDevice = token || this.FCMToken;
        if (devicesFCM.indexOf(newDevice) === -1) {
          if (newDevice) {
            devicesFCM.push(newDevice);
            this.userDevicesFCMDoc.set(
              { devices: devicesFCM },
              { merge: true }
            );
          }
        }
      })
    );
  }

  logout(): any {
    const logout = super.logout();
    return logout;
  }
}
