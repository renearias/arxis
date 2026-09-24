# Contributing to @arxis/api

Thanks for your interest in improving `@arxis/api`. Bug reports, ideas and pull requests are welcome.

## Reporting a bug or asking for a feature

Open an [issue](https://github.com/renearias/arxis/issues/new/choose). For bugs, a minimal reproduction helps a lot: you can fork the [StackBlitz example](https://stackblitz.com/github/renearias/arxis/tree/master/examples/angular-standalone) and share the link.

## Development setup

You need Node.js 24 (see `.nvmrc`) and Chrome for the tests.

```bash
git clone https://github.com/renearias/arxis.git
cd arxis
npm ci
```

| Command | What it does |
|---------|--------------|
| `npm test` | Runs the unit tests in watch mode |
| `npm run test:ci` | Runs the unit tests once in headless Chrome |
| `npx ng build @arxis/api` | Builds the package into `dist/arxis/api` |

The library source is in [`projects/arxis/api`](projects/arxis/api). The code in [`legacy/`](legacy) isn't maintained.

## Pull requests

1. Create a branch from `master`.
2. Add or update tests in `projects/arxis/api/src/lib/*.spec.ts` for any behavior change.
3. Make sure `npm run test:ci` and the build pass.
4. Describe the change in the `Unreleased` section of the [CHANGELOG](projects/arxis/api/CHANGELOG.md).
5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, for example `fix(api): ...` or `feat(api): ...`.
