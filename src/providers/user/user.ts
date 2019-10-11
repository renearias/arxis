import { Injectable, Optional, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { ArxisIonicFireStoreAuthService as ArxisUser } from '@arxis/fireauth';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import 'firebase/auth';
import * as _ from 'lodash';
import { ROUTE_FCM_DOC } from 'projects/arxis/fireauth/src/public-api';
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
export class User extends ArxisUser {
  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public firebasePlugin: Firebase,
    public platform: Platform,
    @Inject(ROUTE_FCM_DOC) routeFCMDoc: string,
  ) {
    super(afAuth, afs, firebasePlugin, platform, routeFCMDoc);
  }
}
