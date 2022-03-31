import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { EndPointConfig } from './endpoint-config.interface';
import { Observable } from 'rxjs';

export const API_ENDPOINT_CONFIG: InjectionToken<EndPointConfig> =
  new InjectionToken<EndPointConfig>('arxis.API_ENDPOINT_CONFIG');

export interface IRequestOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    withCredentials?: boolean;
    responseType?: 'json';
}


export interface IEventsRequestOptions extends IRequestOptions {
  observe: 'events';
}

export interface IResponseRequestOptions extends IRequestOptions {
  observe: 'response';
}

export interface IBodyRequestOptions extends IRequestOptions {
  observe: 'body';
}

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


  /**
   * Constructs a `GET` request that interprets the body as a JSON object and returns the full event stream.
   *
   * @param url     The endpoint URL.
   * @param options The HTTP options to send with the request.
   *
   * @return An `Observable` of the response, with a response body in the requested type.
   */
  get<T>(
    endpoint: string,
    params?: any,
    reqOpts?: IEventsRequestOptions
  ): Observable<HttpEvent<T>>;

  /**
   * Constructs a `GET` request that interprets the body as a JSON object and
   * returns the full `HTTPResponse`.
   *
   * @return An `Observable` of the full `HTTPResponse` for the request,
   * with a response body in the requested type.
   */
  get<T>(
    endpoint: string,
    params?: any,
    reqOpts?: IResponseRequestOptions
  ): Observable<HttpResponse<T>>;

  /**
   * Constructs a `GET` request that interprets the body as a JSON object and returns
   * the response body in a given type.
   *
   * @return An `Observable` of the `HTTPResponse`, with a response body in the requested type.
   */
  get<T>(
    endpoint: string,
    params?: any,
    reqOpts?: IBodyRequestOptions
  ): Observable<T>;

  get<T>(
    endpoint: string,
    params?: any,
    reqOpts?: IResponseRequestOptions | IBodyRequestOptions | IEventsRequestOptions
  ): Observable<HttpEvent<T>>|Observable<HttpResponse<T>>|Observable<T> {
    if (!reqOpts) {
      reqOpts = {
        observe: 'body',
        responseType: 'json',
        params: new HttpParams(),
      } as IBodyRequestOptions;
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams({ fromObject: params });
    }

    // console.log(reqOpts);
    return this.http.get<T>(this.url + '/' + endpoint, reqOpts as IBodyRequestOptions);
  }




  post<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IEventsRequestOptions
  ): Observable<HttpEvent<T>>;

  post<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IResponseRequestOptions
  ): Observable<HttpResponse<T>>;

  /**
   * Constructs a `POST` request that interprets the body as a JSON object
   * and returns an observable of the response.
   *
   * @return  An `Observable` of the `HTTPResponse` for the request, with a response body in the requested type.
   */
  post<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IBodyRequestOptions
  ): Observable<T>;


  post<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IResponseRequestOptions | IBodyRequestOptions | IEventsRequestOptions
  ): Observable<HttpEvent<T>>|Observable<HttpResponse<T>>|Observable<T> {
    if (!reqOpts) {
      reqOpts = {
        observe: 'body',
        responseType: 'json',
      };
    }

    return this.http.post<T>(this.url + '/' + endpoint, body, reqOpts as IBodyRequestOptions);
  }



  put<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IEventsRequestOptions
  ): Observable<HttpEvent<T>>;

  put<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IResponseRequestOptions
  ): Observable<HttpResponse<T>>;

  /**
   * Constructs a `PUT` request that interprets the body as a JSON object
   * and returns an observable of the response.
   *
   * @return An `Observable` of the `HTTPResponse` for the request, with a response body in the requested type.
   */
  put<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IBodyRequestOptions
  ): Observable<T>;


  put<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IResponseRequestOptions | IBodyRequestOptions | IEventsRequestOptions
  ): Observable<HttpEvent<T>>|Observable<HttpResponse<T>>|Observable<T> {
    return this.http.put<T>(this.url + '/' + endpoint, body, reqOpts as IBodyRequestOptions);
  }



  delete<T>(
    endpoint: string,
    reqOpts?: IEventsRequestOptions
  ): Observable<HttpEvent<T>>;

  delete<T>(
    endpoint: string,
    reqOpts?: IResponseRequestOptions
  ): Observable<HttpResponse<T>>;

  /**
   * Constructs a DELETE request that interprets the body as a JSON object and returns
   * the response in a given type.
   *
   * @return An `Observable` of the `HTTPResponse`, with response body in the requested type.
   */
  delete<T>(
    endpoint: string,
    reqOpts?: IBodyRequestOptions
  ): Observable<T>;

  delete<T>(
    endpoint: string,
    reqOpts?: IResponseRequestOptions | IBodyRequestOptions | IEventsRequestOptions
  ): Observable<HttpEvent<T>>|Observable<HttpResponse<T>>|Observable<T> {
    return this.http.delete<T>(this.url + '/' + endpoint, reqOpts as IBodyRequestOptions);
  }



  patch<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IEventsRequestOptions
  ): Observable<HttpEvent<T>>;

  patch<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IResponseRequestOptions
  ): Observable<HttpResponse<T>>;

  /**
   * Constructs a `PATCH` request that interprets the body as a JSON object
   * and returns the response in a given type.
   *
   * @return  An `Observable` of the `HttpResponse` for the request,
   * with a response body in the given type.
   */
  patch<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IBodyRequestOptions
  ): Observable<T>;

  patch<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IResponseRequestOptions | IBodyRequestOptions | IEventsRequestOptions
  ): Observable<HttpEvent<T>>|Observable<HttpResponse<T>>|Observable<T> {
    return this.http.patch<T>(this.url + '/' + endpoint, body, reqOpts as IBodyRequestOptions);
  }
}
