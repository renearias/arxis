import { Injectable, InjectionToken, Inject } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { EndPointConfig } from './endpoint-config.interface';
import { Observable } from 'rxjs';
import {
  HttpResponseType,
  IBodyRequestOptions,
  IResponseRequestOptions,
  HttpMethod,
  IEventsRequestOptions,
} from './types';
import { normalizeQueryParamsObject, normalizeRequestOptions } from './helpers';

export const API_ENDPOINT_CONFIG: InjectionToken<EndPointConfig> = new InjectionToken<
  EndPointConfig
>('arxis.API_ENDPOINT_CONFIG');

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
   * This methods run BEFORE each request, but after taking request info.
   *
   * Useful to read headers and params on inject global values before sending the actual request.
   *
   */
  protected onRequesting<
    TOptions extends
      | IBodyRequestOptions<HttpResponseType>
      | IResponseRequestOptions<HttpResponseType>
      | IEventsRequestOptions<HttpResponseType>
  >(method: HttpMethod, options: TOptions): TOptions {
    return options;
  }

  // =======================================================================================================================================
  // GET

  // TODO: Restringir el T según el tipo de respuesta
  /**
   * Constructs a `GET` request that interprets the body as, by default, a JSON object and returns
   * the response body in a given type.
   *
   * @return An `Observable` of the `HTTPResponse`, with a response body in the requested type.
   */
  get<T>(
    endpoint: string,
    params?: HttpParams | Record<string, string | string[]> | null,
    reqOpts?: IBodyRequestOptions<HttpResponseType>
  ): Observable<T>;

  /**
   * Constructs a `GET` request that interprets the body as a JSON object and
   * returns the full `HTTPResponse`.
   *
   * @return An `Observable` of the full `HTTPResponse` for the request,
   * with a response body in the requested type.
   */
  get<T>(
    endpoint: string,
    params: HttpParams | Record<string, string | string[]> | null,
    reqOpts: IResponseRequestOptions<HttpResponseType>
  ): Observable<HttpResponse<T>>;

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
    params: HttpParams | Record<string, string | string[]> | null,
    reqOpts: IEventsRequestOptions<HttpResponseType>
  ): Observable<HttpEvent<T>>;

  // ---------------------------------------------------------------------------------------------------------------------------------------

  get<T>(
    endpoint: string,
    params?: HttpParams | Record<string, string | string[]> | null,
    reqOpts?:
      | IEventsRequestOptions<HttpResponseType>
      | IResponseRequestOptions<HttpResponseType>
      | IBodyRequestOptions<HttpResponseType>
  ): Observable<HttpEvent<T>> | Observable<HttpResponse<T>> | Observable<T> {
    reqOpts = normalizeRequestOptions(reqOpts);

    if (!!params) {
      reqOpts.params = normalizeQueryParamsObject(params);
    }

    reqOpts = this.onRequesting('GET', reqOpts);

    // console.log(reqOpts);
    return this.http.get<T>(
      this.url + '/' + endpoint,
      reqOpts as IBodyRequestOptions<'json'>
    );
  }

  // =======================================================================================================================================
  /**
   * Constructs a `POST` request and returns an observable of the infered response type (by default, 'JSON').
   *
   * @return  An `Observable` of the `HTTPResponse` for the request, with a response body in the requested type.
   */
  post<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IBodyRequestOptions<HttpResponseType>
  ): Observable<T>;

  post<T>(
    endpoint: string,
    body: any | null,
    reqOpts: IResponseRequestOptions<HttpResponseType>
  ): Observable<HttpResponse<T>>;

  post<T>(
    endpoint: string,
    body: any | null,
    reqOpts: IEventsRequestOptions<HttpResponseType>
  ): Observable<HttpEvent<T>>;

  post<T>(
    endpoint: string,
    body: any | null,
    reqOpts?:
      | IEventsRequestOptions<HttpResponseType>
      | IResponseRequestOptions<HttpResponseType>
      | IBodyRequestOptions<HttpResponseType>
  ): Observable<HttpEvent<T>> | Observable<HttpResponse<T>> | Observable<T> {
    reqOpts = this.onRequesting('POST', normalizeRequestOptions(reqOpts));

    return this.http.post<T>(
      this.url + '/' + endpoint,
      body,
      reqOpts as IBodyRequestOptions<'json'>
    );
  }

  // =======================================================================================================================================

  /**
   * Constructs a `PUT` request that interprets the body as a JSON object
   * and returns an observable of the response.
   *
   * @return An `Observable` of the `HTTPResponse` for the request, with a response body in the requested type.
   */
  put<T>(
    endpoint: string,
    body: any | null,
    reqOpts?: IBodyRequestOptions<HttpResponseType>
  ): Observable<T>;

  put<T, TResponseType extends HttpResponseType>(
    endpoint: string,
    body: any | null,
    reqOpts: IEventsRequestOptions<TResponseType>
  ): Observable<HttpEvent<T>>;

  put<T, TResponseType extends HttpResponseType>(
    endpoint: string,
    body: any | null,
    reqOpts: IResponseRequestOptions<TResponseType>
  ): Observable<HttpResponse<T>>;

  put<T>(
    endpoint: string,
    body: any | null,
    reqOpts?:
      | IEventsRequestOptions<HttpResponseType>
      | IResponseRequestOptions<HttpResponseType>
      | IBodyRequestOptions<HttpResponseType>
  ): Observable<HttpEvent<T>> | Observable<HttpResponse<T>> | Observable<T> {
    reqOpts = this.onRequesting('PUT', normalizeRequestOptions(reqOpts));

    return this.http.put<T>(
      this.url + '/' + endpoint,
      body,
      reqOpts as IBodyRequestOptions<'json'>
    );
  }

  delete<T>(
    endpoint: string,
    reqOpts: IEventsRequestOptions<HttpResponseType>
  ): Observable<HttpEvent<T>>;

  delete<T>(
    endpoint: string,
    reqOpts: IResponseRequestOptions<HttpResponseType>
  ): Observable<HttpResponse<T>>;

  /**
   * Constructs a DELETE request that interprets the body as a JSON object and returns
   * the response in a given type.
   *
   * @return An `Observable` of the `HTTPResponse`, with response body in the requested type.
   */
  delete<T>(
    endpoint: string,
    reqOpts?: IBodyRequestOptions<HttpResponseType>
  ): Observable<T>;

  delete<T>(
    endpoint: string,
    reqOpts?:
      | IEventsRequestOptions<HttpResponseType>
      | IResponseRequestOptions<HttpResponseType>
      | IBodyRequestOptions<HttpResponseType>
  ): Observable<HttpEvent<T>> | Observable<HttpResponse<T>> | Observable<T> {
    reqOpts = this.onRequesting('DELETE', normalizeRequestOptions(reqOpts));

    return this.http.delete<T>(
      this.url + '/' + endpoint,
      reqOpts as IBodyRequestOptions<'json'>
    );
  }

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
    reqOpts?: IBodyRequestOptions<HttpResponseType>
  ): Observable<T>;

  patch<T>(
    endpoint: string,
    body: any | null,
    reqOpts: IResponseRequestOptions<HttpResponseType>
  ): Observable<HttpResponse<T>>;

  patch<T>(
    endpoint: string,
    body: any | null,
    reqOpts: IEventsRequestOptions<HttpResponseType>
  ): Observable<HttpEvent<T>>;

  patch<T>(
    endpoint: string,
    body: any | null,
    reqOpts?:
      | IBodyRequestOptions<HttpResponseType>
      | IResponseRequestOptions<HttpResponseType>
      | IEventsRequestOptions<HttpResponseType>
  ): Observable<HttpEvent<T>> | Observable<HttpResponse<T>> | Observable<T> {
    reqOpts = this.onRequesting('PATCH', normalizeRequestOptions(reqOpts));

    return this.http.patch<T>(
      this.url + '/' + endpoint,
      body,
      reqOpts as IBodyRequestOptions<'json'>
    );
  }
}
