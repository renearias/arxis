import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { IonicModule } from '@ionic/angular';
import 'firebase/auth';
import 'firebase/firestore';

import { ArxisSmsAuthService } from '../services';
import { ArxisFireAuthService } from '../services/user/fire-auth.service';
import { ArxisFireStoreAuthService } from '../services/user/firestore-auth.service';
import {
  ArxisIonicFireStoreAuthService,
  ROUTE_FCM_DOC,
} from '../services/user/ionic-firestore-auth.service';

@NgModule({
  declarations: [],
  imports: [
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicModule.forRoot(),
  ],
  exports: [],
  providers: [],
})
export class ArxisFireAuthModule {
  static forRoot(options: {
    [key: string]: any;
  }): ModuleWithProviders<ArxisFireAuthModule> {
    return {
      ngModule: ArxisFireAuthModule,
      providers: [
        FirebaseX,
        { provide: FIREBASE_OPTIONS, useValue: options },
        { provide: ROUTE_FCM_DOC, useValue: 'FCM' },
        ArxisFireAuthService,
        ArxisFireStoreAuthService,
        ArxisIonicFireStoreAuthService,
        ArxisSmsAuthService,
      ],
    };
  }
}
