import {
  EnvironmentProviders,
  Provider,
  makeEnvironmentProviders,
} from '@angular/core';
import { ApiService, API_ENDPOINT_CONFIG } from './api.service';
import { EndPointConfig } from './endpoint-config.interface';

/**
 * Provides `ApiService` for Angular applications (v17+).
 *
 * Use it in your application config, in the `providers` of a lazy route (to get a
 * separate instance with its own url) or in the `providers` of an NgModule.
 * `HttpClient` must be provided too, with `provideHttpClient()`.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideHttpClient } from '@angular/common/http';
 * import { provideApi } from '@arxis/api';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(),
 *     provideApi({ url: 'https://api.example.com' }),
 *   ],
 * };
 * ```
 *
 * @param endpoint - The API endpoint configuration.
 * @param extras - Additional providers to include.
 * @returns The `EnvironmentProviders` that configure the `ApiService`.
 */
export function provideApi(
  endpoint: EndPointConfig,
  ...extras: Array<Provider | EnvironmentProviders>
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: API_ENDPOINT_CONFIG, useValue: endpoint },
    ApiService,
    ...extras,
  ]);
}
