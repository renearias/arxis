# @arxis/api

> Lightweight, type-safe Angular HTTP client wrapper — simplify REST API calls with a clean service layer.

[![npm](https://img.shields.io/npm/v/@arxis/api)](https://www.npmjs.com/package/@arxis/api)
[![Angular](https://img.shields.io/badge/Angular-17%2B-dd0031)](https://angular.dev)

Stop writing repetitive `HttpClient` boilerplate. `@arxis/api` provides a typed `ApiService` that wraps Angular's `HttpClient` with a consistent interface for GET, POST, PUT, PATCH, and DELETE — with automatic base URL management and global headers. Configure it once with `provideApi()` and get it anywhere with `inject(ApiService)`.

## Why use this?

- **Less boilerplate** — No need to repeat `this.http.get(baseUrl + '/endpoint')` everywhere.
- **Global headers** — Set API keys or fixed headers once, applied to every request automatically.
- **Type-safe** — Full TypeScript generics for request and response types.
- **Modern Angular** — `providedIn: 'root'`, `inject()` and `provideApi()` environment providers.
- **Observable-based** — Returns `Observable<T>`, `Observable<HttpResponse<T>>`, or `Observable<HttpEvent<T>>` depending on your needs.
- **Zero config** — Just provide a base URL and start making requests.

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

Global headers are fixed when the app starts. For values that change, like an auth token, use an `HttpInterceptorFn` with `provideHttpClient(withInterceptors([...]))`.

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

## Keywords

angular http client, angular rest api service, angular api wrapper, angular httpclient wrapper, angular http service, angular api service, typed http client angular, angular standalone api provider, angular inject api service, angular global headers, angular base url configuration

## License

MIT
