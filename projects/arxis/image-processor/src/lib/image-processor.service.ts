import { Injectable, NgZone } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

const { Filesystem } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ImageProcessorService {
  constructor(private _ngZone: NgZone, private camera: Camera) {}

  async processImage(
    filepath: string
  ): Promise<{ data: string; extension: string; type: string }> {
    const nativeFilePath = filepath;
    const fileValue = await Filesystem.readFile({ path: nativeFilePath });
    const extension: string = nativeFilePath.split('.').pop();
    const type: string =
      ['mov', 'avi', 'mp4', 'mpeg'].indexOf(extension.toLocaleLowerCase()) ===
      -1
        ? `image/${extension}`
        : `video/${extension}`;

    return { data: fileValue.data, extension, type };
  }

  async selectImage() {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.ALLMEDIA,
      destinationType: this.camera.DestinationType.FILE_URI
    };

    return await this.camera.getPicture(options);
  }

  readWebFile(
    event: any
  ): Promise<{ data: string; extension: string; type: string }> {
    const file = event.target.files[0];

    if (!file) {
      return Promise.reject({ message: 'No File' });
    }

    return new Promise((resolve, reject) => {
      const reader = getFileReader();

      reader.onload = readerEvent => {
        const imageData = (readerEvent.target as any).result;

        const extension = file.name.split('.').pop();
        const type = file.type;

        resolve({ data: imageData, extension, type });
      };

      reader.readAsDataURL(file);
    });
  }

  readWebFileAsBlob(
    event: any
  ): Promise<{ data: File; extension: string; type: string }> {
    const file = event.target.files[0];

    if (!file) {
      return Promise.reject({ message: 'No File' });
    }

    return new Promise((resolve, reject) => {
      const extension = file.name.split('.').pop();
      const type = file.type;

      resolve({ data: file, extension, type });
    });
  }
}

export function getFileReader(): FileReader {
  const fileReader = new FileReader();
  const zoneOriginalInstance = (fileReader as any)[
    '__zone_symbol__originalInstance'
  ];

  return zoneOriginalInstance || fileReader;
}
