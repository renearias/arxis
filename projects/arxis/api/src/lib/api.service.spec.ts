import {
  FetchBackend,
  HttpBackend,
  HttpResponse,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  EnvironmentInjector,
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  Provider,
  createEnvironmentInjector,
  importProvidersFrom,
  inject,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ApiModule } from './api.module';
import { API_ENDPOINT_CONFIG, ApiService } from './api.service';
import { provideApi } from './provide-api';

const BASE_URL = 'https://api.example.com';
const OTHER_URL = 'https://other.example.com';

@Injectable({ providedIn: 'root' })
class OtherApiService extends ApiService {
  constructor() {
    super({ url: OTHER_URL, globalHeaders: { 'X-Other': 'yes' } });
  }
}

@Injectable({ providedIn: 'root' })
class InheritedApiService extends ApiService {}

describe('ApiService', () => {
  let httpTesting: HttpTestingController | undefined;

  function setup(...providers: Array<Provider | EnvironmentProviders>): void {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ...providers],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => (httpTesting = undefined));
  afterEach(() => httpTesting?.verify());

  describe('requests', () => {
    let api: ApiService;

    beforeEach(() => {
      setup(
        provideApi({ url: BASE_URL, globalHeaders: { 'X-Api-Key': 'key-123' } })
      );
      api = TestBed.inject(ApiService);
    });

    it('sends GET requests to the base url with the query params', () => {
      let users: string[] | undefined;
      api.get<string[]>('users', { role: 'admin' }).subscribe((u) => (users = u));

      const req = httpTesting!.expectOne(`${BASE_URL}/users?role=admin`);
      expect(req.request.method).toBe('GET');
      req.flush(['ana']);

      expect(users).toEqual(['ana']);
    });

    it('adds the global headers to every request', () => {
      api.delete('users/1').subscribe();

      const req = httpTesting!.expectOne({
        method: 'DELETE',
        url: `${BASE_URL}/users/1`,
      });
      expect(req.request.headers.get('X-Api-Key')).toBe('key-123');
      req.flush(null);
    });

    it('sends the body with POST, PUT and PATCH', () => {
      const body = { name: 'Ana' };

      for (const method of ['post', 'put', 'patch'] as const) {
        api[method]('users/1', body).subscribe();

        const req = httpTesting!.expectOne({
          method: method.toUpperCase(),
          url: `${BASE_URL}/users/1`,
        });
        expect(req.request.body).toEqual(body);
        req.flush({});
      }
    });

    it('emits the full HttpResponse when observe is "response"', () => {
      let response: HttpResponse<{ id: number }> | undefined;
      api
        .get<{ id: number }>('users/1', null, { observe: 'response' })
        .subscribe((r) => (response = r));

      httpTesting!.expectOne(`${BASE_URL}/users/1`).flush({ id: 1 });

      expect(response).toBeInstanceOf(HttpResponse);
      expect(response?.body).toEqual({ id: 1 });
    });
  });

  describe('injection', () => {
    it('can be injected with inject() after provideApi()', () => {
      setup(provideApi({ url: BASE_URL }));

      const api = TestBed.runInInjectionContext(() => inject(ApiService));

      expect(api.url).toBe(BASE_URL);
    });

    it('is provided in root, so only the endpoint config is required', () => {
      setup({ provide: API_ENDPOINT_CONFIG, useValue: { url: BASE_URL } });

      expect(TestBed.inject(ApiService).url).toBe(BASE_URL);
    });

    it('throws a descriptive error when no endpoint config is provided', () => {
      setup();

      expect(() => TestBed.inject(ApiService)).toThrowError(/provideApi\(/);
    });

    it('provideApi() returns EnvironmentProviders', () => {
      const providers: EnvironmentProviders = provideApi({ url: BASE_URL });

      expect(providers).toBeDefined();
    });

    it('registers the extra providers passed to provideApi()', () => {
      const EXTRA = new InjectionToken<string>('EXTRA');
      setup(provideApi({ url: BASE_URL }, { provide: EXTRA, useValue: 'extra' }));

      expect(TestBed.inject(EXTRA)).toBe('extra');
    });

    it('creates a separate instance when provided in a child injector', () => {
      setup(provideApi({ url: BASE_URL }));
      const rootApi = TestBed.inject(ApiService);

      const child = createEnvironmentInjector(
        [provideApi({ url: OTHER_URL })],
        TestBed.inject(EnvironmentInjector)
      );
      const childApi = child.get(ApiService);

      expect(childApi.url).toBe(OTHER_URL);
      expect(childApi).not.toBe(rootApi);
      child.destroy();
    });
  });

  describe('subclasses', () => {
    it('can pass their own endpoint config to super()', () => {
      setup();
      const api = TestBed.inject(OtherApiService);

      api.get('status').subscribe();

      const req = httpTesting!.expectOne(`${OTHER_URL}/status`);
      expect(req.request.headers.get('X-Other')).toBe('yes');
      req.flush(null);
    });

    it('without a constructor use the config from provideApi()', () => {
      setup(provideApi({ url: BASE_URL }));

      expect(TestBed.inject(InheritedApiService).url).toBe(BASE_URL);
    });
  });
});

describe('ApiModule', () => {
  it('forRoot() provides ApiService with the given config', () => {
    TestBed.configureTestingModule({
      imports: [ApiModule.forRoot({ url: BASE_URL })],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(TestBed.inject(ApiService).url).toBe(BASE_URL);
  });

  it('forRoot() does not override the HttpClient configuration of the app', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        importProvidersFrom(ApiModule.forRoot({ url: BASE_URL })),
      ],
    });

    expect(TestBed.inject(HttpBackend)).toBeInstanceOf(FetchBackend);
  });
});
