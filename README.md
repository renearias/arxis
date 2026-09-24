# @arxis/api — type-safe HTTP client for Angular

> Stop repeating `HttpClient` boilerplate. Set your REST API base URL and headers once with `provideApi()`, then `inject(ApiService)` anywhere in your Angular app.

[![npm version](https://img.shields.io/npm/v/@arxis/api?logo=npm)](https://www.npmjs.com/package/@arxis/api)
[![npm downloads](https://img.shields.io/npm/dm/@arxis/api)](https://www.npmjs.com/package/@arxis/api)
[![CI](https://github.com/renearias/arxis/actions/workflows/ci.yml/badge.svg)](https://github.com/renearias/arxis/actions/workflows/ci.yml)
[![Angular 17+](https://img.shields.io/badge/Angular-17%2B-dd0031?logo=angular)](https://angular.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/renearias/arxis/tree/master/examples/angular-standalone?file=src%2Fapp%2Fposts.service.ts)

`@arxis/api` is a small, typed wrapper around Angular's `HttpClient` for REST APIs. It gives you an `ApiService` with `get`, `post`, `put`, `patch` and `delete`, a base URL you configure once, and headers that go with every request. It uses the `HttpClient` of your app, so your interceptors, `withFetch()` and testing tools keep working.

## Quick start

```bash
npm install @arxis/api
```

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApi } from '@arxis/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideApi({
      url: 'https://api.example.com',
      globalHeaders: { 'X-Api-Key': 'key-123' },
    }),
  ],
};
```

```ts
// user.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '@arxis/api';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  getUsers() {
    return this.api.get<User[]>('users'); // GET https://api.example.com/users
  }

  createUser(body: CreateUserDto) {
    return this.api.post<User>('users', body); // POST https://api.example.com/users
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

## Documentation

The full documentation is in the [package README](projects/arxis/api/README.md):

- [Before and after](projects/arxis/api/README.md#before-and-after): `HttpClient` compared with `ApiService`
- [Configuration](projects/arxis/api/README.md#configuration): standalone apps, NgModules and `EndPointConfig`
- [Multiple APIs](projects/arxis/api/README.md#multiple-apis): subclasses and per-route base URLs
- [Testing](projects/arxis/api/README.md#testing) with `HttpTestingController`
- [FAQ](projects/arxis/api/README.md#faq): base URLs, headers on every request, auth tokens
- [Migrating from 1.x to 3.0](projects/arxis/api/README.md#migrating-from-1x-to-30)
- [Changelog](projects/arxis/api/CHANGELOG.md)

## Compatibility

| Angular version | `@arxis/api` |
|-----------------|--------------|
| 17.x and newer  | `^3.0.0`     |
| 12.x – 16.x     | `^1.7.4`     |

## Example

[`examples/angular-standalone`](examples/angular-standalone) is an Angular 21 app that loads and creates posts on JSONPlaceholder. [Open it in StackBlitz](https://stackblitz.com/github/renearias/arxis/tree/master/examples/angular-standalone?file=src%2Fapp%2Fposts.service.ts) to try `@arxis/api` in your browser.

## Contributing

Bug reports, ideas and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the development setup.

## Legacy packages

This repository also has the code of `@arxis/fireauth` and `@arxis/image-processor`. They're no longer maintained; see [`legacy/`](legacy).

## License

[MIT](LICENSE) © Rene Arias
