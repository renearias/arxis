import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { ApiService, API_ENDPOINT_CONFIG } from './api.service';
import { EndPointConfig } from './endpoint-config.interface';

/**
 * Provides `ApiService` for standalone Angular applications (v14+).
 *
 * Use this in your application config instead of `ApiModule.forRoot()`.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideApi } from '@arxis/api';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideApi({ url: 'https://api.example.com' }),
 *   ],
 * };
 * ```
 *
 * @param endpoint - The API endpoint configuration.
 * @param extras - Additional providers to include (e.g., interceptors).
 * @returns `EnvironmentProviders` that configure the `ApiService`.
 */
export function provideApi(
  endpoint: EndPointConfig,
  ...extras: Provider[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: API_ENDPOINT_CONFIG, useValue: endpoint },
    ApiService,
    provideHttpClient(),
    ...extras,
  ]);
}
