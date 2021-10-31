import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { EndPointConfig } from './endpoint-config.interface';
import { Observable } from 'rxjs';

export const API_ENDPOINT_CONFIG: InjectionToken<EndPointConfig> =
  new InjectionToken<EndPointConfig>('arxis.API_ENDPOINT_CONFIG');

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

  get<T>(
    endpoint: string,
    params?: any,
    reqOpts?: any
  ): Observable<HttpEvent<T>> {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams({ fromObject: params });
    }

    console.log(reqOpts);

    return this.http.get<T>(this.url + '/' + endpoint, reqOpts);
  }

  post<T>(
    endpoint: string,
    body: any,
    reqOpts?: any
  ): Observable<HttpEvent<T>> {
    return this.http.post<T>(this.url + '/' + endpoint, body, reqOpts);
  }

  put<T>(endpoint: string, body: any, reqOpts?: any): Observable<HttpEvent<T>> {
    return this.http.put<T>(this.url + '/' + endpoint, body, reqOpts);
  }

  delete<T>(endpoint: string, reqOpts?: any): Observable<HttpEvent<T>> {
    return this.http.delete<T>(this.url + '/' + endpoint, reqOpts);
  }

  patch<T>(
    endpoint: string,
    body: any,
    reqOpts?: any
  ): Observable<HttpEvent<T>> {
    return this.http.patch<T>(this.url + '/' + endpoint, body, reqOpts);
  }
}
