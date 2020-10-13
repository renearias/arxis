import { Plugins } from '@capacitor/core';
import {
  CapacitorFirebaseAuthPlugin,
  FacebookSignInResult,
  GoogleSignInResult,
  PhoneSignInResult,
  SignInOptions,
  SignInResult,
  TwitterSignInResult,
} from 'capacitor-firebase-auth/dist/esm/definitions';
import { auth } from 'firebase/app';
import 'firebase/auth';

import {
  NativeOnlySignInCredential,
  ProviderId,
  SignInCredential,
} from '../../../declarations';
import { Exception } from '../../../exceptions';

// @ts-ignore
const plugin: CapacitorFirebaseAuthPlugin = Plugins.CapacitorFirebaseAuth;

/**
 * Contiene las facades para iniciar y cerrar sesión en las capas nativa y web.
 *
 * Permite usar las credenciales nativas antes de realizar el registro real en Firebase.
 *
 * @link https://github.com/baumblatt/capacitor-firebase-auth/blob/master/src/alternative/alternative.ts
 */
export class CapacitorFirebaseAuthFacades {
  // Avoid instances (static class)
  private constructor() {}

  // --------------------------------------------------------------------------
  // Google
  // --------------------------------------------------------------------------
}

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 *
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 * @param nativeOnly Only performs native sign-in.
 */
export const cfaSignIn = async <TnativeOnly extends boolean = false>(
  providerId: string,
  data?: SignInOptions,
  nativeOnly?: TnativeOnly
): Promise<
  TnativeOnly extends true
    ? NativeOnlySignInCredential<SignInResult>
    : SignInCredential<SignInResult>
> => {
  const googleProvider = new auth.GoogleAuthProvider().providerId;
  const facebookProvider = new auth.FacebookAuthProvider().providerId;
  const twitterProvider = new auth.TwitterAuthProvider().providerId;
  const phoneProvider = new auth.PhoneAuthProvider().providerId;

  switch (providerId) {
    case googleProvider:
      return cfaSignInGoogle(nativeOnly);
    case twitterProvider:
      return cfaSignInTwitter(nativeOnly);
    case facebookProvider:
      return cfaSignInFacebook(nativeOnly);
    case phoneProvider:
      if (!data) {
        throw new Error('No data defined for cfaSignInPhone');
      }

      return cfaSignInPhone(data.phone, data.verificationCode);
    default:
      throw new Error(`Provider '${providerId}' is not supported`);
  }
};

/**
 * Call the Google sign in method on native layer and sign in on web layer, exposing the entire native result
 * for use Facebook API with "user auth" authentication and the entire user credential from Firebase.
 *
 * @return Observable<{user: firebase.User, result: GoogleSignInResult}}>
 * @param onlyNative=false Only performs native sign-in.
 * @See Issue #23.
 */
export const cfaSignInGoogle = async <TnativeOnly extends boolean = false>(
  nativeOnly?: TnativeOnly
): Promise<
  TnativeOnly extends true
    ? NativeOnlySignInCredential<GoogleSignInResult>
    : SignInCredential<GoogleSignInResult>
> => {
  // get the provider id
  const providerId = auth.GoogleAuthProvider.PROVIDER_ID;

  // native sign in
  const result = await (plugin.signIn({ providerId }) as Promise<
    GoogleSignInResult
  >);

  // create the credentials
  const credential = auth.GoogleAuthProvider.credential(result.idToken);

  const nativeCrendentials: NativeOnlySignInCredential<GoogleSignInResult> = {
    credential,
    result,
  };

  // Nota: Se usa `any` porque no infiere bien el tipo condicional
  // https://github.com/artsy/artsy.github.io/issues/500

  if (nativeOnly) {
    return nativeCrendentials as any; // 💩
  }

  // web sign in
  const firebaseCredentials: SignInCredential<GoogleSignInResult> = await cfaFirebaseSignIn(
    nativeCrendentials
  );

  return firebaseCredentials as any; // 💩
};

/**
 * Call the Facebook sign in method on native and sign in on web layer, exposing the entire native result
 * for use Facebook API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: FacebookSignInResult}}>
 * @See Issue #23.
 */
export const cfaSignInFacebook = async <TnativeOnly extends boolean = false>(
  nativeOnly?: TnativeOnly
): Promise<
  TnativeOnly extends true
    ? NativeOnlySignInCredential<FacebookSignInResult>
    : SignInCredential<FacebookSignInResult>
> => {
  // get the provider id
  const providerId = auth.FacebookAuthProvider.PROVIDER_ID;

  // native sign in
  const result = await (plugin.signIn({ providerId }) as Promise<
    FacebookSignInResult
  >);

  // create the credentials
  const credential = auth.FacebookAuthProvider.credential(result.idToken);

  const nativeCrendentials: NativeOnlySignInCredential<FacebookSignInResult> = {
    credential,
    result,
  };

  // Nota: Se usa `any` porque no infiere bien el tipo condicional
  // https://github.com/artsy/artsy.github.io/issues/500

  if (nativeOnly) {
    return nativeCrendentials as any; // 💩
  }

  // web sign in
  const firebaseCredentials: SignInCredential<FacebookSignInResult> = await cfaFirebaseSignIn(
    nativeCrendentials
  );

  return firebaseCredentials as any; // 💩
};

/**
 * Call the Twitter sign in method on native and sign in on web layer, exposing the entire native result
 * for use Twitter User API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: TwitterSignInResult}}>
 * @See Issue #23.
 */
export const cfaSignInTwitter = async <TnativeOnly extends boolean = false>(
  nativeOnly?: TnativeOnly
): Promise<
  TnativeOnly extends true
    ? NativeOnlySignInCredential<TwitterSignInResult>
    : SignInCredential<TwitterSignInResult>
> => {
  // get the provider id
  const providerId = auth.FacebookAuthProvider.PROVIDER_ID;

  // native sign in
  const result = await (plugin.signIn({ providerId }) as Promise<
    TwitterSignInResult
  >);

  // create the credentials
  const credential = auth.TwitterAuthProvider.credential(
    result.idToken,
    result.secret
  );

  const nativeCrendentials: NativeOnlySignInCredential<TwitterSignInResult> = {
    credential,
    result,
  };

  // Nota: Se usa `any` porque no infiere bien el tipo condicional
  // https://github.com/artsy/artsy.github.io/issues/500

  if (nativeOnly) {
    return nativeCrendentials as any; // 💩
  }

  // web sign in
  const firebaseCredentials: SignInCredential<TwitterSignInResult> = await cfaFirebaseSignIn(
    nativeCrendentials
  );

  return firebaseCredentials as any; // 💩
};

/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * This implementation is just to keep everything in compliance if others providers in this alternative calls.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = async <
  TnativeOnly extends boolean = false,
  TverificationCode extends string | undefined = string
>(
  phone: string,
  verificationCode?: TverificationCode,
  nativeOnly?: TnativeOnly
): Promise<
  TnativeOnly extends true
    ? TverificationCode extends string
      ? NativeOnlySignInCredential<PhoneSignInResult>
      : Omit<NativeOnlySignInCredential<PhoneSignInResult>, 'credential'>
    : SignInCredential<PhoneSignInResult>
> => {
  // get the provider id
  const providerId = auth.PhoneAuthProvider.PROVIDER_ID;

  const result = await (plugin.signIn({
    providerId,
    data: { phone, verificationCode },
  }) as Promise<PhoneSignInResult>);

  // if there is no verification code
  if (!result.verificationCode) {
    const partial: Omit<
      NativeOnlySignInCredential<PhoneSignInResult>,
      'credential'
    > = { result };

    return partial as any; // 💩
  }

  // create the credentials
  const credential = auth.PhoneAuthProvider.credential(
    result.verificationId,
    result.verificationCode
  );

  const nativeCrendentials: NativeOnlySignInCredential<PhoneSignInResult> = {
    credential,
    result,
  };

  // Nota: Se usa `any` porque no infiere bien el tipo condicional
  // https://github.com/artsy/artsy.github.io/issues/500

  if (nativeOnly) {
    return nativeCrendentials as any; // 💩
  }

  // web sign in
  const firebaseCredentials: SignInCredential<PhoneSignInResult> = await cfaFirebaseSignIn(
    nativeCrendentials
  );

  return firebaseCredentials as any; // 💩
};

/**
 * Performs the sign-in in Firebase.
 */
export const cfaFirebaseSignIn = async <T extends SignInResult>(
  signInCredential: NativeOnlySignInCredential<T>
): Promise<SignInCredential<T>> => {
  // web sign in
  const userCredential = await auth().signInWithCredential(
    signInCredential.credential
  );

  const webAuth: SignInCredential<T> = {
    userCredential,
    result: signInCredential.result,
  };

  return webAuth;
};

/**
 *
 */
export const cfaSignOut = async (onlyNative = false): Promise<void> => {
  await plugin.signOut({});

  if (!onlyNative) {
    await auth().signOut();
  }
};
