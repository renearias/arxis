# @arxis/api

> Lightweight, type-safe Angular HTTP client wrapper — simplify REST API calls with a clean service layer.

[![npm](https://img.shields.io/npm/v/@arxis/api)](https://www.npmjs.com/package/@arxis/api)
[![Angular](https://img.shields.io/badge/Angular-10_--_21%2B-dd0031)](https://angular.dev)

Stop writing repetitive `HttpClient` boilerplate. `@arxis/api` provides a typed, injectable `ApiService` that wraps Angular's `HttpClient` with a consistent interface for GET, POST, PUT, PATCH, and DELETE — with automatic base URL management, global headers, and full support for standalone and NgModule architectures.

## Why use this?

- **Less boilerplate** — No need to repeat `this.http.get(baseUrl + '/endpoint')` everywhere.
- **Global headers** — Set auth tokens or API keys once, applied to every request automatically.
- **Type-safe** — Full TypeScript generics for request and response types.
- **Standalone & NgModule** — Works with `provideApi()` (Angular 14+) or `ApiModule.forRoot()` (Angular 10+).
- **Observable-based** — Returns `Observable<T>`, `Observable<HttpResponse<T>>`, or `Observable<HttpEvent<T>>` depending on your needs.
- **Zero config** — Just provide a base URL and start making requests.

## Compatibility

| Angular Version | Support |
|----------------|---------|
| 10.x – 13.x   | `ApiModule.forRoot()` |
| 14.x – 21.x+  | `ApiModule.forRoot()` / `provideApi()` |

## Installation

```bash
npm install @arxis/api
```

## Configuration

### Standalone apps (Angular 14+) — Recommended

Use `provideApi()` in your application config:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApi } from '@arxis/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    ...provideApi({ url: 'https://api.example.com' }),
  ],
};
```

You can pass additional providers (e.g. interceptors) as extra arguments:

```ts
provideHttpClient(withInterceptors([authInterceptor])),
...provideApi({ url: 'https://api.example.com' }),
```

### NgModule apps (Angular 10+)

Use `ApiModule.forRoot()` in your root module:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApiModule } from '@arxis/api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ApiModule.forRoot({ url: 'https://api.example.com' }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

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

## Usage

Inject `ApiService` and use the HTTP methods:

```ts
import { ApiService } from '@arxis/api';

@Injectable()
export class UserService {
  constructor(private api: ApiService) {}

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

## Features in detail

### Base URL management

Configure once, use everywhere. All endpoints are relative to the base URL:

```ts
// Configured with: { url: 'https://api.example.com' }
api.get('users');       // GET https://api.example.com/users
api.post('orders', {}); // POST https://api.example.com/orders
```

### Global headers

Inject authentication tokens, API keys, or any header into every outgoing request:

```ts
provideApi({
  url: 'https://api.example.com',
  globalHeaders: {
    'Authorization': 'Bearer my-token',
    'X-Api-Key': 'key-123',
  },
})
```

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

## Keywords

angular http client, angular rest api service, angular api wrapper, angular httpclient wrapper, angular http service, angular api service, typed http client angular, angular standalone api provider, angular global headers, angular base url configuration

## License

MIT
