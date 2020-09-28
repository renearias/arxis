import IProviderUserData from './provider-user-data.interface';
import { SignInResult } from 'capacitor-firebase-auth';

export interface IProviderResultInfo {
  data?: IProviderUserData;
  providerResult?: SignInResult;
}

export default IProviderResultInfo;
