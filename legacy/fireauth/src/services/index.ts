import { IncompleteRegistrationService } from './auth/incomplete-registration.service';
import { ArxisSmsCordovaAuthService } from './auth/sms-auth-cordova.service';
import { ArxisSmsAuthService } from './auth/sms-auth.service';
import { ArxisDeviceService } from './device/device';
import { ArxisFireAuthService } from './user/fire-auth.service';
import { ArxisFireStoreAuthService } from './user/firestore-auth.service';
import {
  ArxisIonicFireStoreAuthService,
  ROUTE_FCM_DOC
} from './user/ionic-firestore-auth.service';
export {
  ArxisDeviceService,
  ArxisFireAuthService,
  ArxisFireStoreAuthService,
  ArxisIonicFireStoreAuthService,
  ArxisSmsCordovaAuthService,
  ArxisSmsAuthService,
  IncompleteRegistrationService,
  ROUTE_FCM_DOC
};
