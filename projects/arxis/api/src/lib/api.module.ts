import { NgModule, ModuleWithProviders, Injector, Inject } from '@angular/core';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService, API_ENDPOINT_CONFIG } from './api.service';
import { EndPointConfig } from './endpoint-config.interface';

export function _apiServiceFactory(endpoint: EndPointConfig, http: HttpClient) {
  return new ApiService(endpoint, http);
}

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  exports: []
})
export class ApiModule {
  static forRoot(enpoint: EndPointConfig): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [{ provide: API_ENDPOINT_CONFIG, useValue: enpoint }, ApiService]
    };
  }
}
