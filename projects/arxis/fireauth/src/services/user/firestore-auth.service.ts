import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { ArxisFireAuthService } from './fire-auth.service';
import { switchMap, map } from 'rxjs/operators';
import { ArxisFirestoreAuthAbstractInterface } from './firestore-auth-abstract.interface';

@Injectable()
export class ArxisFireStoreAuthService extends ArxisFireAuthService
  implements ArxisFirestoreAuthAbstractInterface<any> {
  userFireStoreDoc: AngularFirestoreDocument<any>;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) {
    super(afAuth);
  }

  setAuthState(): any {
    this.authState = this.afAuth.authState.pipe(
      switchMap(this.authFillAction.bind(this))
    );
  }

  authFillAction(user: firebase.User): Observable<any> {
    if (user) {
      this.userFireStoreDoc = this.afs.doc('users/' + user.uid);
      return this.userFireStoreDoc.valueChanges().pipe(
        map((account: Account) => {
          if (!account) {
            _.extend(user, { NO_FIRESTORE_DATA: true });
          }
          return _.extend(user, account);
        })
      );
    } else {
      /// not signed in
      return of(null);
    }
  }
}
