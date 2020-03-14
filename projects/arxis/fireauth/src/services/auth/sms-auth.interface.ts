import * as firebase from 'firebase/app';

export class ArxisSmsAuthInterface {
  verificationId: string;
  confirmationResult: any;
  recaptchaVerifier: any;

  sendSMSVerification: (
    phone: any,
    verifier?: firebase.auth.RecaptchaVerifier
  ) => Promise<string>;

  sendSMSVerificationIOS: (phone: string) => any;

  confirm: (
    code: string,
    verificationId: string
  ) => Promise<firebase.auth.AuthCredential>;
}
