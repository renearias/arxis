import { NgModule, ModuleWithProviders } from '@angular/core';
import { ArxisFireAuthService } from '../services/user/fire-auth.service';
import { AngularFireModule, FirebaseOptionsToken } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ArxisFireStoreAuthService } from '../services/user/firestore-auth.service';
import { ArxisIonicFireStoreAuthService } from '../services/user/ionic-firestore-auth.service';
import { IonicModule, Platform } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';

@NgModule({
  declarations: [],
  imports: [
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicModule.forRoot()
  ],
  exports: [],
  providers: []
})
export class ArxisFireAuthModule {
  static forRoot(options: { [key: string]: any }): ModuleWithProviders {
    return {
      ngModule: ArxisFireAuthModule,
      providers: [
        Firebase,
        { provide: FirebaseOptionsToken, useValue: options },
        ArxisFireAuthService,
        ArxisFireStoreAuthService,
        ArxisIonicFireStoreAuthService
      ]
    };
  }
}
