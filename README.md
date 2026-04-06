<p align="center">
  <img src="https://devic.ai/logo.svg" width="120" alt="Devic AI" />
</p>

<h1 align="center">Devic Open-Source Module Template</h1>

<p align="center">
  Template repository for building standalone modules compatible with the <a href="https://devic.ai">Devic AI</a> harness.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#entity-extensions">Entity Extensions</a> &middot;
  <a href="#configuration">Configuration</a> &middot;
  <a href="#api-conventions">API Conventions</a> &middot;
  <a href="#contributing">Contributing</a>
</p>

---

## What is this?

This is the **official template** for creating open-source modules that work as standalone services and are fully compatible with the [Devic AI](https://devic.ai) orchestration harness.

Devic is a cloud harness that orchestrates AI agents, tools, and services. Instead of building everything into a monolith, Devic's strategy is to **open-source independent modules** that anyone can run, use, and contribute to — while Devic integrates them via their APIs.

### Design principles

1. **Standalone first** — Every module is a fully functional service on its own. No Devic dependency required.
2. **Config-driven extensions** — Multi-tenancy, scoping, and additional entity properties are configured via YAML, not code changes.
3. **API-based integration** — Devic (or any other system) communicates with modules via HTTP API. No shared runtime, no embedded imports.
4. **Community-friendly** — `docker run`, edit a config file, and you have a working service.

---

## Quick Start

### 1. Use this template

Click **"Use this template"** on GitHub, or:

```bash
git clone https://github.com/devic-ai/module-template my-module
cd my-module
rm -rf .git && git init
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure

```bash
cp config.example.yml config.yml
# Edit config.yml with your database and settings
```

### 4. Run

```bash
# Development
yarn start:dev

# Production
yarn build && yarn start:prod

# Docker
docker build -t my-module .
docker run -p 3100:3100 -v ./config.yml:/app/config.yml my-module
```

---

## Architecture

### Module as a standalone service

Each Devic OS module runs as an **independent HTTP service** with its own database, configuration, and API:

```
┌─────────────────────────────────────────┐
│           Your Module (standalone)        │
│                                          │
│  config.yml → extensions, db, auth       │
│  REST API  → /api/v1/resources           │
│  Database  → MongoDB / PostgreSQL        │
└─────────────────────────────────────────┘
```

### Integration with Devic

When integrated with Devic, the module runs as one more microservice. Devic communicates via HTTP through a thin wrapper that translates its internal context (JWT, tenant info) into headers:

```
┌──────────────────────────────────┐
│        Devic Cloud (private)      │
│                                   │
│  SuntropyAI                       │
│    └─ ModuleWrapper (thin client) │
│         │                         │
│         │  HTTP + headers          │
│         │  x-client-uid: abc       │
│         │  x-project-id: 1         │
│         ▼                         │
│  ┌─────────────────────────┐      │
│  │  Your Module (standalone)│      │
│  │  config.yml with         │      │
│  │  extensions enabled      │      │
│  └─────────────────────────┘      │
└──────────────────────────────────┘
```

### Integration with any other platform

The same mechanism works for any platform, not just Devic. Any system can integrate a module by:

1. Deploying the module with a `config.yml` defining its extension properties
2. Sending the appropriate headers with each API request

---

## Entity Extensions

The **entity extension system** is the core mechanism that makes modules work both standalone and within multi-tenant platforms like Devic — **without changing a single line of module code**.

### How it works

1. The module defines **clean domain entities** (Document, Folder, etc.) with no tenancy or scoping logic.
2. At boot time, the module reads `config.yml` and **dynamically adds extension properties** to the database schemas.
3. A middleware **extracts extension values from request headers** and injects them into every query and create operation.

### Configuration

```yaml
# config.yml
extensions:
  properties:
    - name: clientUID
      type: string
      required: true           # 400 error if header missing
      index: true              # creates a database index
      entities: "*"            # applies to ALL entities
      source: header
      headerName: x-client-uid

    - name: projectId
      type: string
      required: false
      index: true
      entities:                # applies only to these
        - Document
        - Folder
      source: header
      headerName: x-project-id

    - name: region
      type: string
      required: false
      index: false
      entities: "*"
      source: header
      headerName: x-region
```

### Behavior

With the configuration above:

| Operation | Without extensions | With extensions configured |
|-----------|-------------------|--------------------------|
| `GET /api/v1/documents` | `find({})` | `find({ clientUID: 'abc', projectId: '1' })` |
| `POST /api/v1/documents` | `create({ title, content })` | `create({ title, content, clientUID: 'abc', projectId: '1' })` |
| `GET /api/v1/documents/:id` | `findOne({ _id })` | `findOne({ _id, clientUID: 'abc' })` |
| Missing required header | N/A | `400 Bad Request` |

### Technical implementation (Mongoose)

Extensions use Mongoose's `schema.add()` API to register properties **before** models are compiled. This is not a hack — it's the same mechanism that `@Prop()` decorators use internally:

```
Boot sequence:
  1. Read config.yml
  2. Connect to database
  3. Create base schemas (from decorated classes)
  4. schema.add() for each extension property    ← before model()
  5. Register models with enriched schemas
  6. Start HTTP server
```

The result is indistinguishable from having declared the property with `@Prop()` in the class. Fields are validated, indexed, and queryable like any native property.

### Supported types

| Type in config | Mongoose type | Use case |
|---------------|---------------|----------|
| `string` | `String` | IDs, names, codes |
| `number` | `Number` | Numeric identifiers |
| `boolean` | `Boolean` | Feature flags |
| `date` | `Date` | Timestamps |

---

## Configuration

### Full reference

```yaml
# config.yml

# --- Server ---
server:
  port: 3100                   # HTTP port
  basePath: /api/v1            # API prefix
  cors:
    enabled: true
    origins:
      - http://localhost:3000

# --- Database ---
database:
  provider: mongodb            # mongodb | postgres
  uri: mongodb://localhost:27017/my-module
  # For postgres:
  # host: localhost
  # port: 5432
  # database: my_module
  # username: user
  # password: pass

# --- Storage (if module handles files) ---
storage:
  provider: local              # local | s3 | gcs
  localPath: ./uploads
  maxFileSize: 50mb
  # s3:
  #   bucket: my-bucket
  #   region: eu-west-1
  #   accessKeyId: ${AWS_ACCESS_KEY_ID}
  #   secretAccessKey: ${AWS_SECRET_ACCESS_KEY}

# --- Entity extensions (see section above) ---
extensions:
  properties: []

# --- Service authentication ---
auth:
  enabled: false               # Enable to protect the API
  strategy: api-key            # api-key | jwt | none
  apiKeys:
    - name: my-app
      key: ${MODULE_API_KEY}   # Always use env vars for secrets

# --- Webhooks (optional event notifications) ---
webhooks:
  events:
    # resource.created: https://my-app.com/webhooks/handler
    # resource.updated: https://my-app.com/webhooks/handler
    # resource.deleted: https://my-app.com/webhooks/handler
  headers:
    # Authorization: Bearer ${WEBHOOK_SECRET}
  retries: 3
  timeoutMs: 5000

# --- Logging ---
logging:
  level: info                  # debug | info | warn | error
  format: json                 # json | pretty
```

### Environment variable interpolation

Use `${VAR_NAME}` in config values to reference environment variables. This is the recommended way to handle secrets:

```yaml
auth:
  apiKeys:
    - name: production
      key: ${MODULE_API_KEY}         # Resolved from env at boot
database:
  uri: ${DATABASE_URI}               # Resolved from env at boot
```

---

## API Conventions

All Devic OS modules **must** follow these API conventions to ensure consistency across the ecosystem.

### Base URL

```
{scheme}://{host}:{port}{basePath}/{resource}
```

Example: `http://localhost:3100/api/v1/documents`

### Standard endpoints

Every resource should expose:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/{resource}` | List (with pagination) |
| `GET` | `/{resource}/:id` | Get by ID |
| `POST` | `/{resource}` | Create |
| `PATCH` | `/{resource}/:id` | Partial update |
| `DELETE` | `/{resource}/:id` | Delete |

### Pagination

Use cursor-based or offset pagination consistently:

```json
// Request
GET /api/v1/documents?limit=20&offset=0

// Response
{
  "data": [ ... ],
  "pagination": {
    "total": 142,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Error responses

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Missing required header: x-client-uid",
  "details": {
    "header": "x-client-uid",
    "extension": "clientUID"
  }
}
```

Standard HTTP status codes:

| Code | Usage |
|------|-------|
| `200` | Success |
| `201` | Created |
| `400` | Validation error, missing required extension header |
| `401` | Unauthorized (invalid or missing API key/JWT) |
| `404` | Resource not found (scoped — won't leak across tenants) |
| `409` | Conflict (duplicate, version mismatch) |
| `500` | Internal server error |

### Health check

Every module **must** expose:

```
GET /health
→ 200 { "status": "ok", "version": "1.2.3", "uptime": 3600 }

GET /health/ready
→ 200 { "status": "ready", "database": "connected", "storage": "connected" }
```

### OpenAPI / Swagger

Every module **must** auto-generate an OpenAPI spec available at:

```
GET /api/v1/docs        → Swagger UI
GET /api/v1/docs-json   → OpenAPI JSON spec
```

---

## Project Structure

```
your-module/
├── src/
│   ├── main.ts                    # Bootstrap
│   ├── app.module.ts              # Root module
│   ├── config/
│   │   ├── config.loader.ts       # YAML config reader
│   │   ├── config.schema.ts       # Config validation
│   │   └── config.types.ts        # Config TypeScript types
│   ├── schemas/                   # Mongoose schemas (clean entities)
│   │   └── example.schema.ts
│   ├── dto/                       # Request/Response DTOs
│   │   ├── create-example.dto.ts
│   │   └── update-example.dto.ts
│   ├── repositories/              # Data access layer
│   │   ├── base.repository.ts     # Scoped repository (applies extensions)
│   │   └── example.repository.ts
│   ├── interfaces/                # Public interfaces
│   │   └── index.ts
│   ├── interceptors/
│   │   └── extension-scope.interceptor.ts
│   ├── providers/                 # Pluggable implementations (storage, etc.)
│   │   └── storage/
│   └── health/
│       └── health.controller.ts
├── test/
│   ├── unit/
│   ├── e2e/
│   └── fixtures/
├── examples/
│   ├── standalone/
│   │   └── docker-compose.yml
│   └── with-extensions/
│       ├── docker-compose.yml
│       └── config.yml
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── config.example.yml
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── .env.example
├── LICENSE
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── CODE_OF_CONDUCT.md
```

---

## Standards & Conventions

### Tech stack

| Component | Choice | Notes |
|-----------|--------|-------|
| Runtime | Node.js 24+ | Use nvm for version management |
| Package manager | Yarn | Not npm |
| Framework | NestJS | With TypeScript strict mode |
| Database | MongoDB (Mongoose) | PostgreSQL (TypeORM) for relational needs |
| Config | YAML | `config.yml` at project root |
| API docs | Swagger/OpenAPI | Auto-generated from decorators |
| Testing | Jest | Unit + e2e |
| Linting | ESLint + Prettier | Shared config from template |
| Container | Docker | Multi-stage build |

### Versioning

- **Semantic Versioning** (semver) — `MAJOR.MINOR.PATCH`
- **Conventional Commits** — enforced via commitlint:
  - `feat:` new feature (minor bump)
  - `fix:` bug fix (patch bump)
  - `feat!:` or `BREAKING CHANGE:` (major bump)
  - `chore:`, `docs:`, `test:`, `ci:` (no version bump)
- **CHANGELOG.md** auto-generated from commits

### Breaking changes policy

1. Deprecate in a minor release with console warnings
2. Document migration path in CHANGELOG
3. Remove in the next major release
4. Never break config.yml backwards compatibility within a major version

### Testing requirements

| Type | Minimum coverage | Scope |
|------|-----------------|-------|
| Unit | 80% | Services, repositories, utilities |
| E2E | Happy paths | All API endpoints |
| Extension tests | Required | Verify scoping works with configured extensions |

### CI/CD

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `ci.yml` | PR + push to main | lint, test, build, coverage |
| `release.yml` | Tag `v*` | build, Docker push, GitHub release |

---

## License

All Devic open-source modules use the **Apache License 2.0**.

This allows:
- Commercial use
- Modification and distribution
- Patent protection
- Private use

While requiring:
- License and copyright notice preservation
- State changes documentation

See [LICENSE](./LICENSE) for the full text.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

**TL;DR:**

1. Fork the repo
2. Create a feature branch (`feat/my-feature`)
3. Follow conventional commits
4. Ensure tests pass (`yarn test`)
5. Open a PR against `main`

---

## Checklist: Ready for Open Source

Before publishing a module built from this template, verify:

- [ ] No credentials, tokens, or internal URLs in the code
- [ ] All extension properties work correctly via `config.yml`
- [ ] Tests pass without any Devic infrastructure
- [ ] README updated with module-specific documentation
- [ ] `config.example.yml` covers all options
- [ ] Dockerfile builds and runs correctly
- [ ] Health endpoints respond correctly
- [ ] OpenAPI spec is generated and accessible
- [ ] LICENSE file present (Apache 2.0)
- [ ] `package.json` has: name, version, description, repository, keywords, license, engines
- [ ] CI workflows configured and passing

---

<p align="center">
  Built with <a href="https://devic.ai">Devic AI</a> — Orchestrate AI agents, tools, and services.
</p>
