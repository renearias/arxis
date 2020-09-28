import {
  Plugins,
  DeviceInfo,
  PermissionType,
  PermissionResult,
} from '@capacitor/core';

const { Device, PushNotifications, Permissions } = Plugins;

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ArxisDeviceService {
  info: DeviceInfo;
  constructor() {}

  async getInfo() {
    if (!this.info) {
      this.info = await Device.getInfo();
    }
    return this.info;
  }

  async is(type: string) {
    return (await this.getInfo()).platform === type;
  }

  async requestPushNotifications() {
    if (!(PushNotifications as any).requestPermission) {
      (PushNotifications as any).requestPermissions();
    }
    return (PushNotifications as any).requestPermission();
  }

  async hasPermissionNotifications(): Promise<PermissionResult> {
    return Permissions.query({ name: PermissionType.Notifications });
  }
}
