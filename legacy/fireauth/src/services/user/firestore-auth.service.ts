import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { User } from 'firebase/app';
import 'firebase/auth';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ArxisFireAuthService } from './fire-auth.service';
import { ArxisFirestoreAuthAbstractInterface } from './firestore-auth-abstract.interface';

@Injectable()
export class ArxisFireStoreAuthService extends ArxisFireAuthService
  implements ArxisFirestoreAuthAbstractInterface<any> {
  userFireStoreDoc: AngularFirestoreDocument<any> | undefined;

  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) {
    super(afAuth);
  }

  setAuthState() {
    this.authState = this.afAuth.authState.pipe(
      switchMap(this.authFillAction.bind(this))
    );
  }

  authFillAction(user: User | null): Observable<any> {
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
