# @arxis/api example

A small Angular 21 app that uses [`@arxis/api`](https://www.npmjs.com/package/@arxis/api) to load and create posts on [JSONPlaceholder](https://jsonplaceholder.typicode.com).

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/renearias/arxis/tree/master/examples/angular-standalone?file=src%2Fapp%2Fposts.service.ts)

- [`src/app/app.config.ts`](src/app/app.config.ts) configures the base url with `provideApi()`.
- [`src/app/posts.service.ts`](src/app/posts.service.ts) gets `ApiService` with `inject()` and calls `get()` and `post()`.

## Run it locally

```bash
npm install
npm start
```
