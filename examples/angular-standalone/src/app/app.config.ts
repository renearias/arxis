import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideApi } from '@arxis/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    // Every ApiService request goes to this base url, with these headers.
    provideApi({
      url: 'https://jsonplaceholder.typicode.com',
      globalHeaders: { Accept: 'application/json' },
    }),
  ],
};
