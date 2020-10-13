import { SignInResult } from 'capacitor-firebase-auth/dist/esm/definitions';
import { auth } from 'firebase/app';

export type FacebookProviderId = 'facebook.com';
export type GoogleProviderId = 'google.com';
export type TwitterProviderId = 'twitter.com';
export type PhoneProviderId = 'phone';
export type ProviderId =
  | FacebookProviderId
  | GoogleProviderId
  | TwitterProviderId
  | PhoneProviderId
  | 'password'
  // Other
  | 'playgames.google.com'
  | 'github.com';

/**
 * Credenciales cuando se inicia sesión y se crea el usuario en Firebase.
 */
export interface SignInCredential<T extends SignInResult> {
  userCredential: auth.UserCredential;
  result: T;
}

/**
 * Credenciales cuando sólo se inicia sesión en la capa nativa.
 */
export interface NativeOnlySignInCredential<T extends SignInResult> {
  credential: auth.OAuthCredential;
  result: T;
}
