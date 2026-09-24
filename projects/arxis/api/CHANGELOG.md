# Changelog

All notable changes to `@arxis/api` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-09-23

### Added

- `ApiService` is `providedIn: 'root'`, so `inject(ApiService)` works as soon as `provideApi()` is in your providers.
- Subclasses can pass their own config to `super(config)`, for example `super(inject(MY_API_CONFIG))`.
- A descriptive error when `ApiService` is injected without an endpoint config.
- Support for Angular 22. Peer dependencies are now `>=17.0.0`, so new Angular versions don't need a new release to install.
- `rxjs` peer dependency (`^6.5.3 || ^7.4.0`).

### Changed

- **BREAKING:** Angular 17 or newer is required. The package is built with Angular 17 in the current package format (`fesm2022` with an `exports` map). Apps on Angular 12–16 should stay on `1.x`.
- **BREAKING:** `provideApi()` returns `EnvironmentProviders` (built with `makeEnvironmentProviders`), so it's used without a spread.
- **BREAKING:** `ApiService` gets `HttpClient` with `inject()`. Its constructor only takes an optional `EndPointConfig`, so subclasses call `super(config)` instead of `super(config, http)`.
- **BREAKING:** `ApiModule` no longer imports `HttpClientModule`. Apps must provide `HttpClient` with `provideHttpClient()`.
- `ApiModule` is deprecated in favor of `provideApi()`.

### Removed

- **BREAKING:** `_apiServiceFactory`.
- The `ngcc` postinstall entry. `ngcc` doesn't exist since Angular 16.

### Fixed

- `ApiModule.forRoot()` no longer replaces the `HttpClient` setup of the app, such as `withFetch()`.

## [1.7.0] - 2026-04-20

### Added

- `provideApi()` function for standalone Angular applications (v14+). This is the recommended way to configure `ApiService` in modern Angular projects.
- Support for Angular 21 (`^21.0.0`) in peer dependencies.
- Extra providers parameter in `provideApi()` for passing interceptors and other providers.

### Changed

- Updated `README.md` with full documentation including compatibility table, standalone and NgModule usage examples, `EndPointConfig` reference, and API method signatures.

## [1.6.2]

### Fixed

- Minor maintenance release.

## [1.6.0]

### Added

- Support for Angular 20 in peer dependencies.

## [1.0.0]

### Added

- Initial release of `@arxis/api`.
- `ApiService` with `get`, `post`, `put`, `patch`, `delete` methods.
- `ApiModule.forRoot()` for NgModule-based configuration.
- `EndPointConfig` interface with `url` and `globalHeaders`.
- Request options with `observe` and `responseType` overloads.
- `normalizeRequestOptions`, `normalizeHeadersObject`, `normalizeQueryParamsObject` helpers.
