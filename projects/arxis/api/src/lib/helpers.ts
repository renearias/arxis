import { HttpHeaders, HttpParams } from '@angular/common/http';

import {
  HttpResponseType,
  IBodyRequestOptions,
  INormalizedRequestOptions,
  IAnyRequestOptions,
} from './types';

/**
 * Genera un objeto HttpHeaders a partir de una entrada compatible.
 */
export const normalizeHeadersObject = (
  headers?: HttpHeaders | Record<string, string | string[]>
): HttpHeaders => {
  if (!headers || headers instanceof HttpHeaders) {
    headers = headers ?? new HttpHeaders();
  } else {
    headers = new HttpHeaders(headers);
  }

  return headers as HttpHeaders;
};

/**
 * Genera un objeto HttpParams a partir de una entrada compatible.
 */
export const normalizeQueryParamsObject = (
  params: HttpParams | Record<string, string | string[]> | undefined
): HttpParams => {
  if (!params || params instanceof HttpParams) {
    params = params ?? new HttpParams();
  } else {
    params = new HttpParams({ fromObject: params });
  }

  return params as HttpParams;
};

export const normalizeRequestOptions = <
  TOptions extends IAnyRequestOptions<HttpResponseType>
>(
  reqOpts: TOptions | undefined
): INormalizedRequestOptions<TOptions> => {
  if (!reqOpts) {
    reqOpts = ({
      observe: 'body',
      responseType: 'json',
    } as IBodyRequestOptions<'json'>) as TOptions;
  }

  if (!reqOpts.observe) {
    reqOpts.observe = 'body';
  }

  reqOpts.headers = normalizeHeadersObject(reqOpts.headers);

  reqOpts.params = normalizeQueryParamsObject(reqOpts.params);

  return reqOpts as INormalizedRequestOptions<TOptions>;
};
