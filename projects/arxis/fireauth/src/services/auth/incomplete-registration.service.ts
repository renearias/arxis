import { Injectable } from '@angular/core';
import {
  FacebookSignInResult,
  GoogleSignInResult,
  SignInResult,
  TwitterSignInResult,
} from 'capacitor-firebase-auth';
import { auth } from 'firebase/app';
import { IProviderResultInfo, IProviderUserData } from '../../interfaces';
import 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class IncompleteRegistrationService {
  public readonly info: IProviderResultInfo = {};

  public get providerResult() {
    return this.info.providerResult;
  }

  public get data() {
    return this.info.data;
  }

  constructor() {}

  isFacebook(): boolean {
    if (!this.providerResult) {
      return false;
    }

    return (
      this.providerResult.providerId === auth.FacebookAuthProvider.PROVIDER_ID
    );
  }

  isGoogle(): boolean {
    if (!this.providerResult) {
      return false;
    }

    return (
      this.providerResult.providerId === auth.GoogleAuthProvider.PROVIDER_ID
    );
  }

  getProviderResultCredentials(): auth.OAuthCredential | undefined {
    let credential: firebase.auth.OAuthCredential | undefined;

    if (this.providerResult) {
      switch (this.providerResult.providerId) {
        case auth.FacebookAuthProvider.PROVIDER_ID:
          credential = auth.FacebookAuthProvider.credential(
            (this.providerResult as FacebookSignInResult).idToken
          );
          break;

        case auth.GoogleAuthProvider.PROVIDER_ID:
          credential = auth.GoogleAuthProvider.credential(
            (this.providerResult as GoogleSignInResult).idToken
          );
          break;

        case auth.TwitterAuthProvider.PROVIDER_ID:
          const r = this.providerResult as TwitterSignInResult;

          credential = auth.TwitterAuthProvider.credential(r.idToken, r.secret);
          break;

        default:
          // TODO: Compatibilidad con los demás providers
          console.error(
            `credential() no implementado para '${this.providerResult.providerId}'. `,
            this.providerResult
          );
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
