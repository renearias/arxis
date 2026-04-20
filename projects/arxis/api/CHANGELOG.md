# Changelog

All notable changes to `@arxis/api` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
