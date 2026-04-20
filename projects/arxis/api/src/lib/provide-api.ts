import { Provider } from '@angular/core';
import { ApiService, API_ENDPOINT_CONFIG } from './api.service';
import { EndPointConfig } from './endpoint-config.interface';

/**
 * Provides `ApiService` for standalone Angular applications (v14+).
 *
 * Use this in your application config instead of `ApiModule.forRoot()`.
 * Remember to also call `provideHttpClient()` in your providers.
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
 *     ...provideApi({ url: 'https://api.example.com' }),
 *   ],
 * };
 * ```
 *
 * @param endpoint - The API endpoint configuration.
 * @param extras - Additional providers to include (e.g., interceptors).
 * @returns An array of `Provider`s that configure the `ApiService`.
 */
export function provideApi(
  endpoint: EndPointConfig,
  ...extras: Provider[]
): Provider[] {
  return [
    { provide: API_ENDPOINT_CONFIG, useValue: endpoint },
    ApiService,
    ...extras,
  ];
}
