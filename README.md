# angular_crud_app

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

# Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

# angular_crud_app

Project description
-------------------

angular_crud_app is a simple Angular CRUD (Create, Read, Update, Delete) demonstration application. It provides a small product management UI that includes a product list, add product form, edit product form, and a theme toggle. The app is organized with component-based structure and uses services for data and theme handling.

Key features
- Product listing with edit and delete
- Add product form with validation
- Edit product form
- Theme toggle (light/dark) persisted by service
- Small, easy-to-follow codebase for learning Angular patterns

Prerequisites
- Node.js (LTS recommended)
- npm (comes with Node.js)
- Optional: Angular CLI for local development (`npm install -g @angular/cli`)

Installation
------------

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
# or
ng serve
```

The app runs at `http://localhost:4200/` by default.

Build
-----

Create a production build:

```bash
npm run build
# or
ng build --prod
```

Tests
-----

Run unit tests (see `package.json` for the configured test script):

```bash
npm test
# or
ng test
```

Project structure (important files)
----------------------------------

- `src/app/` – application source
	- `app.ts`, `app.routes.ts`, `app.config.ts` – core app files
	- `components/` – UI components
		- `product-list/` – list view
		- `add-product/` – add form
		- `edit-product/` – edit form
		- `theme-toggle/` – theme control
	- `services/` – application services (`product.service.ts`, `theme.service.ts`)

Notes on services
- `product.service.ts` – responsible for product CRUD operations (in-memory or API)
- `theme.service.ts` – handles theme state and persistence

Environment & configuration
- Update environment variables or API endpoints (if any) via the app configuration files under `src/app` or environment files.

Branch Protection & Contribution Workflow
----------------------------------------

This repository enforces branch protection on the `main` branch. Follow this workflow to contribute:

1. Create a feature branch from `main` using the naming convention `feature/<short-description>` or `fix/<short-description>`:

```bash
git checkout main
git pull origin main
git checkout -b feature/my-new-feature
```

2. Implement changes on your feature branch and push them to the remote:

```bash
git add .
git commit -m "Short, descriptive message"
git push -u origin feature/my-new-feature
```

3. Open a Pull Request (PR) targeting `main`. In the PR description include what you changed, how to test, and any screenshots if relevant.

4. Approval required: The repository owner/maintainer must review and approve the PR before it can be merged. Do not attempt to push directly to `main` or merge without approval.

5. Once approved by the maintainer, the PR will be merged into `main` by the maintainer.

Pull Request checklist
- All new code is covered by tests where practical
- Linting passes (run any configured linter)
- The development server builds and the relevant flows work locally
- The PR description explains the change and testing steps

Maintainer / Contact
- Repository owner and code reviewer: the project maintainer (contact via the repo's Git provider or internal channels)

License
- Check the repository for a `LICENSE` file or ask the maintainer for license details.

Next steps
- Create a feature branch for your change and open a PR; a maintainer will review and merge when approved.
