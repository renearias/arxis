import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as _ from 'lodash';
import { Address, Business } from '../../models';

export abstract class UserData {
  userFireStoreDoc: AngularFirestoreDocument<any>;
  userFireStoreShards: Array<any> = [];
  userFireStoreShardsSubscription: Subscription;
  primaryAddress: Address;
  primaryAddressDoc: AngularFirestoreCollection<any>;
  primaryAddressSubscription: Subscription;
  primaryBusiness: Business;
  primaryBusinessDoc: AngularFirestoreDocument<any>;
  primaryBusinessSubscription: Subscription;

  readyState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  businessIncomplete: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userDataPromises: Promise<any>[];

  userDataFillSubscription: Subscription;

  constructor(public db: AngularFirestore) { }

  public fillUserData(currentUserId) {
    this.userDataFillSubscription = combineLatest([
      this.getPrimaryAddress(currentUserId),
      this.getPrimaryBusiness(currentUserId)
      .pipe(mergeMap(
        (businesses: Business[]) => {
          if (businesses && businesses[0]) {
            this.primaryBusinessDoc = this.db
              .collection('businesses')
              .doc(businesses[0].key);

            return this.primaryBusinessDoc
              .collection('shards')
              .valueChanges()
              .pipe(map(shardCounters => {
                const counterOrders = {
                  pendingOrders: 0,
                  totalOrders: 0
                };
                shardCounters.forEach(shard => {
                  counterOrders.pendingOrders += shard['pendingOrders'] || 0;
                  counterOrders.totalOrders += shard['totalOrders'] || 0;
                });

                return _.extend(businesses[0], counterOrders);
              }));
          } else {
            return of(null);
          }
        }
      ))
    ])
    .pipe(map(([addresses, business]) => {
        return [addresses[0], business];
      }))
    .subscribe(
      ([address, business]) => {
        this.primaryAddress = address;
        if (business) {
          this.businessIncomplete.next(false);
          this.businessIncomplete.complete();
          this.primaryBusiness = business;
          this.updateReadyState();
        } else {
          this.businessIncomplete.next(true);
          this.businessIncomplete.complete();
        }
      },
      error => {
        console.log('error en frok join', error);
      }
    );
  }

  public getPrimaryAddress(currentUserId) {
    const primaryAdressFilterFunction = ref =>
      ref.where('owner', '==', currentUserId)
        .limit(1);
    this.primaryAddressDoc = this.db.collection(
      'addresses',
      primaryAdressFilterFunction
    );

    return this.primaryAddressDoc.valueChanges();
  }

  public getPrimaryBusiness(currentUserId) {
    const primaryBusinessFilteFurnction = ref =>
      ref.where('owner', '==', currentUserId)
        .limit(1);
    const primaryBusinessQuery = this.db.collection(
      'businesses',
      primaryBusinessFilteFurnction
    );

    return primaryBusinessQuery.snapshotChanges()
      .pipe(map(list => {
        return list.map(this.mapElements);
      }));
  }

  mapElements(action) {
    const itemEl = action.payload.doc.data();
    itemEl.key = action.payload.doc.id;

    return itemEl;
  }

  isReadyData() {
    return !!this.primaryBusiness;
  }

  updateReadyState() {
    if (this.isReadyData()) {
      this.readyState.next(true);
    }

    return false;
  }

  onReady(callBack: Function) {
    return this.readyState.subscribe(ready => {
      if (ready) {
        callBack();
      }
    });
  }

  emptyUserData() {
    this.closeSubscriptions();
    this.userFireStoreDoc = null;
    this.userFireStoreShards = null;
    this.primaryAddress = null;
    this.primaryAddressDoc = null;
    this.primaryBusiness = null;
    this.primaryBusinessDoc = null;
    this.readyState.next(false);
  }

  closeSubscriptions() {
    if (this.userDataFillSubscription) {
      this.userDataFillSubscription.unsubscribe();
      this.userDataFillSubscription = null;
    }
    if (this.userFireStoreShardsSubscription) {
      this.userFireStoreShardsSubscription.unsubscribe();
      this.userFireStoreShardsSubscription = null;
    }
    if (this.primaryAddressSubscription) {
      this.primaryAddressSubscription.unsubscribe();
      this.primaryAddressSubscription = null;
    }
    if (this.primaryBusinessSubscription) {
      this.primaryBusinessSubscription.unsubscribe();
      this.primaryBusinessSubscription = null;
    }
  }
}
