import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserData } from './userData';

export abstract class UserDevices extends UserData {
  FCMToken;
  userDevicesFCMDoc: AngularFirestoreDocument<any>;
  userDevices;
  userDevicesSubscription: Subscription;

  constructor(
    public db: AngularFirestore,
    public firebasePlugin: Firebase,
    public platform: Platform
  ) {
    super(db);
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.firebasePlugin
          .getToken()
          .then(token => {
            this.FCMToken = token;
          }) // save the token server-side and use it to push notifications to this device
          .catch(error => console.error('Error getting token', error));
        this.firebasePlugin.onTokenRefresh().subscribe((token: string) => {
          this.FCMToken = token;
          try {
            this.registerFCMToken();
          } catch (e) {
            console.log('Error updating token', e);
          }
        });
      }
    });
  }

  public fillUserData(currentUserId) {
    super.fillUserData(currentUserId);
    if (this.platform.is('cordova')) {
      this.registerFCMToken();
    }
  }

  registerFCMToken(token?: string) {
    this.userDevicesFCMDoc = this.userFireStoreDoc
      .collection('devices')
      .doc('FCM');
    this.userDevicesSubscription = this.userDevicesFCMDoc
      .valueChanges()
      .subscribe(res => {
        let devicesFCM: Array<string>;
        if (res) {
          devicesFCM = res.devices || [];
        } else {
          devicesFCM = [];
        }
        const newDevice = token || this.FCMToken;
        if (devicesFCM.indexOf(newDevice) === -1) {
          devicesFCM.push(token || this.FCMToken);
          this.userDevicesFCMDoc.set({ devices: devicesFCM }, { merge: true });
        }
        this.userDevicesSubscription.unsubscribe();
      });
  }
}
