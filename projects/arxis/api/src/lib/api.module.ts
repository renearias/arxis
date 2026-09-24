import { NgModule, ModuleWithProviders } from '@angular/core';

import { EndPointConfig } from './endpoint-config.interface';
import { provideApi } from './provide-api';

/**
 * @deprecated Use `provideApi()` in your application providers (it also works in
 * the `providers` of an NgModule). `HttpClient` must be provided by the app with
 * `provideHttpClient()`.
 */
@NgModule()
export class ApiModule {
  static forRoot(endpoint: EndPointConfig): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [provideApi(endpoint)],
    };
  }
}
