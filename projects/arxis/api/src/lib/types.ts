import { HttpHeaders, HttpParams } from '@angular/common/http';

export type HttpResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'text'
  | 'json'
  | undefined;

export type HttpObserve = 'events' | 'response' | 'body' | undefined;

export interface IRequestOptions<
  TObserve extends HttpObserve,
  TResponseType extends HttpResponseType
> {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | string[]>;
  reportProgress?: boolean;
  withCredentials?: boolean;
  observe: TObserve;
  responseType?: TResponseType;
}

export type HttpMethod =
  | 'HEAD'
  | 'OPTIONS'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

export type IEventsRequestOptions<T extends HttpResponseType> = IRequestOptions<
  'events',
  T
>;

export type IResponseRequestOptions<
  T extends HttpResponseType
> = IRequestOptions<'response', T>;

export interface IBodyRequestOptions<T extends HttpResponseType>
  extends Omit<IRequestOptions<'body', T>, 'observe'> {
  observe?: 'body';
}

export type IAnyRequestOptions<T extends HttpResponseType> =
  | IEventsRequestOptions<T>
  | IResponseRequestOptions<T>
  | IBodyRequestOptions<T>;

/**
 * Optiones de la request, pero con el headers y params definidos.
 */
export type INormalizedRequestOptions<
  TOptions extends IAnyRequestOptions<HttpResponseType>
> = Omit<TOptions, 'headers' | 'params'> & {
  headers: HttpHeaders;
  params: HttpParams;
};

// export type IAnyBodyRequestOptions =
//   | IBodyRequestOptions<'arraybuffer'>
//   | IBodyRequestOptions<'blob'>
//   | IBodyRequestOptions<'json'>
//   | IBodyRequestOptions<'text'>;

// export type IJsonBodyRequestOptions = IRequestOptions<'body', 'json'>;
