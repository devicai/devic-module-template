# Contributing to this Devic OS Module

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 24+ (use [nvm](https://github.com/nvm-sh/nvm))
- Yarn (not npm)
- Docker and Docker Compose (for running dependencies)
- MongoDB 7+ (or use the provided docker-compose)

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/MODULE_NAME.git
cd MODULE_NAME

# Install dependencies
yarn install

# Copy and configure
cp config.example.yml config.yml

# Start dependencies (database, etc.)
docker compose up -d mongo

# Run in development
yarn start:dev
```

### Verify your setup

```bash
# Run tests
yarn test

# Run e2e tests
yarn test:e2e

# Check linting
yarn lint
```

## Development Workflow

### 1. Create a branch

```bash
git checkout -b feat/my-feature
# or
git checkout -b fix/my-bugfix
```

### 2. Make your changes

- Write code following the existing patterns in the codebase
- Add tests for new functionality
- Update documentation if needed

### 3. Commit with conventional commits

We enforce [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add document versioning support
fix: correct pagination offset calculation
docs: update API examples in README
test: add e2e tests for delete endpoint
chore: update dependencies
feat!: change response format for list endpoints
```

### 4. Run checks

```bash
yarn lint
yarn test
yarn test:e2e
yarn build
```

### 5. Open a Pull Request

- Target the `main` branch
- Fill in the PR template
- Link related issues
- Wait for CI to pass and a maintainer review

## Code Guidelines

### Entity extensions

If your change adds a new entity or modifies existing ones, ensure:

- The entity class contains **only domain properties** (no tenancy, no scoping)
- The entity is registered in the schema factory so extensions are applied at boot
- Tests cover behavior both with and without extensions configured

### API endpoints

- Follow RESTful conventions (`GET`, `POST`, `PATCH`, `DELETE`)
- Use DTOs with `class-validator` for input validation
- Return consistent response shapes (see README API Conventions)
- Add Swagger decorators for OpenAPI generation

### Testing

- **Unit tests**: test services and repositories in isolation
- **E2E tests**: test API endpoints with a real database
- **Extension tests**: verify that scoping works when extensions are configured
- Place test fixtures in `test/fixtures/`

## Reporting Issues

Use GitHub Issues with the provided templates:

- **Bug report**: include steps to reproduce, expected vs actual behavior, config.yml (sanitized)
- **Feature request**: describe the use case, proposed solution, and alternatives considered

## Code of Conduct

This project follows our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before participating.

## Questions?

- Open a [Discussion](../../discussions) on GitHub
- Check existing issues for similar questions

---

Thank you for helping make this module better for everyone!
