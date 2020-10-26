import { Injectable } from '@angular/core';
import {
  DeviceInfo,
  PermissionResult,
  PermissionType,
  Plugins,
} from '@capacitor/core';

const { Device, PushNotifications, Permissions } = Plugins;

@Injectable({ providedIn: 'root' })
export class ArxisDeviceService {
  info: DeviceInfo | undefined;
  constructor() {}

  async getInfo() {
    if (!this.info) {
      this.info = await Device.getInfo();
    }
    return this.info;
  }

  async is(type: 'ios' | 'android' | 'electron' | 'web') {
    return (await this.getInfo()).platform === type;
  }

  async requestPushNotifications() {
    if (
      !PushNotifications.requestPermission &&
      PushNotifications.requestPermissions
    ) {
      await PushNotifications.requestPermissions(); // 💩 Why this?
    }

    return await PushNotifications.requestPermission();
  }

  async hasPermissionNotifications(): Promise<PermissionResult> {
    return Permissions.query({ name: PermissionType.Notifications });
  }
}
