# @arxis/api — type-safe HTTP client for Angular

> Stop repeating `HttpClient` boilerplate. Set your REST API base URL and headers once with `provideApi()`, then `inject(ApiService)` anywhere in your Angular app.

[![npm version](https://img.shields.io/npm/v/@arxis/api?logo=npm)](https://www.npmjs.com/package/@arxis/api)
[![npm downloads](https://img.shields.io/npm/dm/@arxis/api)](https://www.npmjs.com/package/@arxis/api)
[![CI](https://github.com/renearias/arxis/actions/workflows/ci.yml/badge.svg)](https://github.com/renearias/arxis/actions/workflows/ci.yml)
[![Angular 17+](https://img.shields.io/badge/Angular-17%2B-dd0031?logo=angular)](https://angular.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/renearias/arxis/blob/master/LICENSE)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/renearias/arxis/tree/master/examples/angular-standalone?file=src%2Fapp%2Fposts.service.ts)

`@arxis/api` is a small, typed wrapper around Angular's `HttpClient` for REST APIs. It gives you an `ApiService` with `get`, `post`, `put`, `patch` and `delete`, a base URL you configure once, and headers that go with every request. It uses the `HttpClient` of your app, so your interceptors, `withFetch()` and testing tools keep working.

New to `@arxis/api`? Read the introduction on dev.to: [Stop repeating HttpClient boilerplate in Angular](https://dev.to/renearias/stop-repeating-httpclient-boilerplate-in-angular-40n6).

## Contents

- [Before and after](#before-and-after)
- [Features](#features)
- [Compatibility](#compatibility)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Multiple APIs](#multiple-apis)
- [Features in detail](#features-in-detail)
- [Testing](#testing)
- [FAQ](#faq)
- [Migrating from 1.x to 3.0](#migrating-from-1x-to-30)

## Before and after

With `HttpClient`, every service repeats the base URL and the common headers:

```ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly headers = new HttpHeaders({ 'X-Api-Key': environment.apiKey });

  getUsers() {
    return this.http.get<User[]>(`${this.baseUrl}/users`, { headers: this.headers });
  }
}
```

With `@arxis/api`, you configure them once and each service only describes its endpoints:

```ts
// app.config.ts
provideApi({ url: environment.apiUrl, globalHeaders: { 'X-Api-Key': environment.apiKey } });

// user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  getUsers() {
    return this.api.get<User[]>('users');
  }
}
```

## Features

- **Base URL management** — Write `api.get('users')` instead of `http.get(baseUrl + '/users')`.
- **Global headers** — API keys and fixed headers go with every request automatically.
- **Type-safe** — Generics for response types, plus typed overloads for `observe: 'response'` and `observe: 'events'`.
- **Modern Angular** — `providedIn: 'root'`, `inject()`, `provideApi()` environment providers, standalone apps and NgModules.
- **Multiple APIs** — Extend `ApiService` for each backend, or give a lazy route its own base URL.
- **Uses your `HttpClient`** — Interceptors, `withFetch()` and `HttpTestingController` work as usual.
- **Tiny** — About 1 KB minified and gzipped.

## Compatibility

| Angular version | `@arxis/api` |
|-----------------|--------------|
| 17.x and newer  | `^3.0.0`     |
| 12.x – 16.x     | `^1.7.4`     |

## Installation

```bash
npm install @arxis/api
```

## Configuration

Add `provideApi()` to your application config:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApi } from '@arxis/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideApi({ url: 'https://api.example.com' }),
  ],
};
```

`provideHttpClient()` is required in Angular 17–20. From Angular 21 `HttpClient` is provided by default, but you still need `provideHttpClient()` to add interceptors, `withFetch()` or other HTTP features. `ApiService` uses the `HttpClient` of your app, so all its interceptors apply to API requests.

### NgModule apps

`provideApi()` also works in the `providers` of an NgModule:

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [
    provideHttpClient(),
    provideApi({ url: 'https://api.example.com' }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

`ApiModule.forRoot(config)` is still available but deprecated.

### EndPointConfig

```ts
interface EndPointConfig {
  url: string;
  globalHeaders?: Record<string, string | string[]>;
}
```

| Property        | Type                                    | Description                          |
|-----------------|-----------------------------------------|--------------------------------------|
| `url`           | `string`                                | Base URL for all API requests.       |
| `globalHeaders` | `Record<string, string \| string[]>`    | Headers injected into every request. |

If `ApiService` is injected and no config was provided, it throws an error that tells you to add `provideApi()`.

## Usage

Inject `ApiService` and use the HTTP methods:

```ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '@arxis/api';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  getUsers() {
    return this.api.get<User[]>('users');
  }

  createUser(body: CreateUserDto) {
    return this.api.post<User>('users', body);
  }

  updateUser(id: string, body: Partial<User>) {
    return this.api.put<User>(`users/${id}`, body);
  }

  patchUser(id: string, body: Partial<User>) {
    return this.api.patch<User>(`users/${id}`, body);
  }

  deleteUser(id: string) {
    return this.api.delete<void>(`users/${id}`);
  }
}
```

### Available methods

| Method   | Signature |
|----------|-----------|
| `get`    | `get<T>(endpoint, params?, reqOpts?)` |
| `post`   | `post<T>(endpoint, body, reqOpts?)` |
| `put`    | `put<T>(endpoint, body, reqOpts?)` |
| `patch`  | `patch<T>(endpoint, body, reqOpts?)` |
| `delete` | `delete<T>(endpoint, reqOpts?)` |

All methods support `observe: 'response'` and `observe: 'events'` overloads.

## Multiple APIs

To talk to more than one API, extend `ApiService` and pass the config to `super()`:

```ts
import { Injectable } from '@angular/core';
import { ApiService } from '@arxis/api';

@Injectable({ providedIn: 'root' })
export class BillingApiService extends ApiService {
  constructor() {
    super({ url: 'https://billing.example.com' });
  }
}
```

The config can also come from an injection token: `super(inject(BILLING_API_CONFIG))`. A subclass without a constructor uses the config from `provideApi()`.

You can also provide a different config for part of the app. `provideApi()` in the `providers` of a route creates a separate `ApiService` for that route and its children:

```ts
export const routes: Routes = [
  {
    path: 'admin',
    providers: [provideApi({ url: 'https://admin.example.com' })],
    loadChildren: () => import('./admin/admin.routes'),
  },
];
```

## Features in detail

### Base URL management

Configure once, use everywhere. All endpoints are relative to the base URL:

```ts
// Configured with: { url: 'https://api.example.com' }
api.get('users');       // GET https://api.example.com/users
api.post('orders', {}); // POST https://api.example.com/orders
```

### Global headers

Inject API keys, or any fixed header, into every outgoing request:

```ts
provideApi({
  url: 'https://api.example.com',
  globalHeaders: {
    'X-Api-Key': 'key-123',
  },
})
```

Global headers are fixed when the app starts. For values that change, like an auth token, use an interceptor (see the [FAQ](#how-do-i-send-an-auth-token-with-every-request)).

### Query parameters

Pass query params as a plain object or `HttpParams`:

```ts
api.get<User[]>('users', { role: 'admin', active: 'true' });
// GET https://api.example.com/users?role=admin&active=true
```

### Response types

Control what the Observable emits:

```ts
// Body only (default)
api.get<User[]>('users');

// Full HTTP response (status, headers, body)
api.get<User[]>('users', null, { observe: 'response' });

// HTTP events (upload progress, etc.)
api.post<void>('upload', formData, { observe: 'events', reportProgress: true });
```

## Testing

`ApiService` uses Angular's `HttpClient`, so you test your services with `HttpTestingController` like any other HTTP code:

```ts
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideApi } from '@arxis/api';

it('loads the users', () => {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideApi({ url: 'https://api.example.com' }),
    ],
  });
  const users = TestBed.inject(UserService);
  const httpTesting = TestBed.inject(HttpTestingController);

  users.getUsers().subscribe((list) => expect(list.length).toBe(1));

  httpTesting.expectOne('https://api.example.com/users').flush([{ id: 1 }]);
  httpTesting.verify();
});
```

## FAQ

### How do I set a base URL for HttpClient in Angular?

Add `provideApi({ url: 'https://api.example.com' })` to your providers and make your requests with `ApiService`. Every endpoint is relative to that URL, so `api.get('users')` requests `https://api.example.com/users`. To change the URL per environment, use `provideApi({ url: environment.apiUrl })`.

### How do I add a header to every HTTP request in Angular?

For fixed values, like an API key or `Accept`, use `globalHeaders` in `provideApi()`. For values that change while the app runs, use an interceptor.

### How do I send an auth token with every request?

Use an `HttpInterceptorFn`. `ApiService` uses your app's `HttpClient`, so the interceptor applies to its requests:

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};

// app.config.ts
provideHttpClient(withInterceptors([authInterceptor])),
provideApi({ url: 'https://api.example.com' }),
```

### How do I call more than one API with different base URLs?

Extend `ApiService` once per backend and pass its config to `super()`, or use `provideApi()` in the `providers` of a route. See [Multiple APIs](#multiple-apis).

### Does it work with standalone components and NgModules?

Yes. `provideApi()` works in `ApplicationConfig`, in route `providers` and in NgModule `providers`. Inject the service with `inject(ApiService)` or with a constructor parameter.

### Which Angular versions are supported?

Angular 17 and newer, including Angular 22. For Angular 12–16, use `@arxis/api@^1.7.4`.

### Is it compatible with `withFetch()`, SSR and interceptors?

Yes. `@arxis/api` doesn't create its own `HttpClient`; it uses the one you configure with `provideHttpClient()`, with all its features. It has no browser-only code, so it also runs with server-side rendering.

## Migrating from 1.x to 3.0

1. **Angular 17 or newer is required.** Apps on Angular 12–16 should stay on `@arxis/api@^1.7.4`.
2. **`provideApi()` returns `EnvironmentProviders`.** Remove the spread:

   ```diff
   - ...provideApi({ url: 'https://api.example.com' }),
   + provideApi({ url: 'https://api.example.com' }),
   ```

   Like `provideHttpClient()`, it goes in application, route or NgModule providers, not in the `providers` of a component.
3. **`ApiModule` no longer imports `HttpClientModule`.** Add `provideHttpClient()` to your providers if you don't have it yet. Before, `ApiModule` could replace the `HttpClient` setup of your app (for example, `withFetch()`). `ApiModule` is now deprecated: use `provideApi()`.
4. **Subclasses no longer pass `HttpClient` to `super()`.** `ApiService` gets `HttpClient` with `inject()`:

   ```diff
    @Injectable({ providedIn: 'root' })
    export class BillingApiService extends ApiService {
   -  constructor(@Inject(BILLING_API_CONFIG) endpoint: EndPointConfig, public override http: HttpClient) {
   -    super(endpoint, http);
   +  constructor() {
   +    super(inject(BILLING_API_CONFIG));
      }
    }
   ```

5. **Import everything from `@arxis/api`.** The package now has an `exports` map, so deep imports like `@arxis/api/lib/endpoint-config.interface` can fail to resolve.
6. **`_apiServiceFactory` was removed.**

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](https://github.com/renearias/arxis/blob/master/CONTRIBUTING.md).

## License

[MIT](https://github.com/renearias/arxis/blob/master/LICENSE) © Rene Arias
