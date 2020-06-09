import { Injectable } from '@angular/core';
import { FacebookSignInResult, GoogleSignInResult, SignInResult, TwitterSignInResult } from 'capacitor-firebase-auth';
import * as firebase from 'firebase';
import { IProviderResultInfo, IProviderUserData } from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class IncompleteRegistrationService {
  public readonly info: IProviderResultInfo = { };

  public get providerResult() {
    return this.info.providerResult;
  }

  public get data() {
    return this.info.data;
  }

  constructor() { }

  isFacebook(): boolean {
    if (!this.providerResult) {
      return false;
    }

    return this.providerResult.providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID;
  }

  isGoogle(): boolean {
    if (!this.providerResult) {
      return false;
    }

    return this.providerResult.providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID;
  }

  getProviderResultCredentials(): firebase.auth.OAuthCredential | undefined {
    let credential: firebase.auth.OAuthCredential | undefined;

    if (this.providerResult) {
      switch (this.providerResult.providerId) {
        case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
        case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
          const fb = this.providerResult as FacebookSignInResult | GoogleSignInResult;

          credential = firebase.auth.FacebookAuthProvider.credential(fb.idToken);
          break;

        case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
          const r = this.providerResult as TwitterSignInResult;

          credential = firebase.auth.TwitterAuthProvider.credential(r.idToken, r.secret);
          break;

        default:
          // TODO: Compatibilidad con los demás providers
          console.error(`credential() no implementado para '${this.providerResult.providerId}'. `, this.providerResult);
          break;
      }
    }

    return credential;
  }

  set(result: SignInResult, data: IProviderUserData) {
    this.info.data = data;
    this.info.providerResult = result;
  }

  reset() {
    this.info.data = undefined;
    this.info.providerResult = undefined;
  }
}
