import { SignInResult, FacebookSignInResult, GoogleSignInResult, TwitterSignInResult } from 'capacitor-firebase-auth';
import { IProviderUserData } from '../interfaces';
import * as firebase from 'firebase';

/**
 * Error generado a partir del proceso de autenticación.
 *
 * @param code       Código.
 * @param message    Mensaje.
 * @param data       Infor del usuario.
 * @param result     SignInResult
 * @param innerError Referencia al error padre.
 */
export default class ProviderAuthException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly data: IProviderUserData = {},
    public readonly result?: SignInResult,
    public readonly innerError?: Error | any
  ) {
    super(message);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ProviderAuthException.prototype);
  }

  get credential(): firebase.auth.OAuthCredential | undefined {
    let credential: firebase.auth.OAuthCredential | undefined;

    if (this.result) {
      switch (this.result.providerId) {
        case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
        case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
          credential = firebase.auth.FacebookAuthProvider.credential((this.result as FacebookSignInResult | GoogleSignInResult).idToken);
          break;

        case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
          const r = this.result as TwitterSignInResult;
          credential = firebase.auth.TwitterAuthProvider.credential(r.idToken, r.secret);
          break;

        default:
          // TODO: Compatibilidad con los demás providers
          console.error(`credential() no implementado para '${this.result.providerId}'. `, this.result);
          break;
      }
    }

    return credential;
  }
}