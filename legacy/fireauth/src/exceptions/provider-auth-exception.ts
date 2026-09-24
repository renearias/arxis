import {
  FacebookSignInResult,
  GoogleSignInResult,
  SignInResult,
  TwitterSignInResult,
} from 'capacitor-firebase-auth';
import { auth } from 'firebase/app';
import 'firebase/auth';

import { IProviderUserData } from '../interfaces';

import Exception from './exception';

/**
 * Error generado a partir del proceso de autenticación.
 */
export default class ProviderAuthException extends Exception<
  IProviderUserData
> {
  constructor(
    code: string,
    message: string,
    data: IProviderUserData = {},
    public readonly result?: SignInResult,
    innerError?: Error | any
  ) {
    super({ code, message, data, innerError });
  }

  get credential(): firebase.auth.OAuthCredential | undefined {
    let credential: firebase.auth.OAuthCredential | undefined;

    if (this.result) {
      switch (this.result.providerId) {
        case auth.FacebookAuthProvider.PROVIDER_ID:
        case auth.GoogleAuthProvider.PROVIDER_ID:
          credential = auth.FacebookAuthProvider.credential(
            (this.result as FacebookSignInResult | GoogleSignInResult).idToken
          );
          break;

        case auth.TwitterAuthProvider.PROVIDER_ID:
          const r = this.result as TwitterSignInResult;
          credential = auth.TwitterAuthProvider.credential(r.idToken, r.secret);
          break;

        default:
          // TODO: Compatibilidad con los demás providers
          console.error(
            `credential() no implementado para '${this.result.providerId}'. `,
            this.result
          );
          break;
      }
    }

    return credential;
  }
}
