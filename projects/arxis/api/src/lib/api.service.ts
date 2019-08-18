import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EndPointConfig } from './endpoint-config.interface';

export const API_ENDPOINT_CONFIG: InjectionToken<
  EndPointConfig
> = new InjectionToken<EndPointConfig>('arxis.API_ENDPOINT_CONFIG');

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
// @dynamic
@Injectable()
export class ApiService {
  url: string;
  constructor(
    @Inject(API_ENDPOINT_CONFIG) private endpoint: EndPointConfig,
    public http: HttpClient
  ) {
    this.url = this.endpoint.url;
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams({ fromObject: params });
    }

    console.log(reqOpts);

    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }
}
