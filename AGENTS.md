# GymCoach AI — Master Autonomous Development & Repository Rules

These persistent guidelines govern all autonomous and assisted engineering tasks across the GymCoach AI repository. All agents and automated workflows must adhere strictly to these rules.

---

## 1. Authoritative Sources & Decision Hierarchy

1. **Source of Truth**:
   - The specifications, product goals, and architectural records in `docs/` are authoritative:
     - `docs/architecture/ADR-001.md`: Monorepo structure and service decoupling.
     - `docs/requirements/Product-Vision.md`: Core philosophy, target audience, supported goals, and explicit out-of-scope boundaries.
     - `docs/requirements/System-Architecture.md`: Cross-service boundaries and communication contracts.
     - `docs/requirements/Features.md`: Sprint roadmap and feature status checklist.
     - `docs/requirements/API-Overview.md`: REST route and payload specifications.
     - `docs/requirements/User-Flows.md`: Core user journeys (first-time, daily, weekly).
     - `docs/sprints/`: Sprint objectives and completion records.
     - `docs/development/FUTURE_ENHANCEMENTS.md`: Catalog of approved deferred product concepts.
2. **Conflict Resolution**:
   - If documentation and codebase disagree, inspect the working code and relevant architecture decisions.
   - Preserve existing working behavior, backward compatibility, and established data models unless explicitly mandated by the product requirements.
   - Never assume a feature is incomplete merely because it appears in a roadmap; inspect the implementation and Git history first.
   - Never repeat completed work.

---

## 2. Monorepo Structure & Separation of Concerns

GymCoach AI is structured as a decoupled monorepo ([ADR-001](file:///Users/chaitanya/Projects/gymcoach-ai/docs/architecture/ADR-001.md)):

* **`client/`**: React single-page application built with Vite and modern CSS/UI architecture.
* **`server/`**: Node.js and Express REST API connecting to MongoDB Atlas via Mongoose.
* **`ai-service/`**: Python FastAPI microservice dedicated to ML and LLM workload orchestration.
* **`shared/`**: Shared assets/types (reserved for cross-service schemas).
* **`docs/`**: Centralized project documentation, architectural decision records, and sprint backlogs.

Do not blur boundaries between services (e.g., do not import server code directly into the frontend or vice versa).

---

## 3. Two-Phase Development Model

Development proceeds in two distinct phases:

### Phase 1: Complete Non-AI Application Development (Autonomous)
* The agent independently designs, implements, tests, verifies, documents, and delivers all non-AI functionality defined in the product roadmap.
* Scope covers: user registration and login, authentication/authorization, profile management, dashboard, workout management, exercise management, fitness tracking, progress tracking, equipment management, non-AI nutrition/planning functionality, settings, and other approved non-AI features in `Features.md`.
* Deliver complete full-stack features: frontend, backend, database persistence, and integration. Do not deliver disconnected frontend or backend pieces.
* **AI-Dependent Features in Phase 1**:
  1. Complete independent non-AI infrastructure where appropriate.
  2. Prepare clean API contracts and integration boundaries.
  3. Identify required AI inputs and outputs.
  4. Document pending AI integration.
  5. Keep the feature explicitly marked as AI-pending.
  6. **Never use mocks to pretend an AI-dependent feature is complete.**

### Phase 2: Collaborative AI Development (With Human Developer)
* When Phase 1 is fully complete, transition to collaborative AI development.
* Break AI development into incremental learning milestones (concept explanation, architecture/data flow, model/API selection, prompt engineering, step-by-step implementation, testing, code review, and guided experimentation).
* Do not generate an entire AI system in one large implementation; build production quality while fostering practical AI engineering knowledge.

### Phase 1 Completion Boundary
Phase 1 is complete when all approved non-AI application requirements in `Features.md` have been implemented and verified. At that point:
1. Stop autonomous feature development.
2. Do not start AI implementation independently.
3. Review all non-AI requirements against `Features.md`.
4. Verify frontend/backend integration.
5. Identify every pending AI-dependent feature and document integration boundaries.
6. Produce a complete Phase 1 completion report and structured AI learning roadmap.
7. Wait for the human developer to begin Phase 2 collaboratively.

---

## 4. Backend Layering Architecture

All backend features in `server/src/` must adhere strictly to the established layered architecture:

```
Request ──> [Route] ──> [Validator] ──> [Auth Middleware] ──> [Controller] ──> [Service] ──> [Model (Mongoose)]
```

* **`routes/`**: Mount URL paths and bind validator arrays, middleware, and controllers.
* **`validators/`**: Input validation chains using `express-validator`. Never place raw database queries in validators.
* **`middleware/`**: Cross-cutting logic (e.g., `authMiddleware.js` for JWT authentication and permission checks).
* **`controllers/`**: Parse HTTP request payloads, check `validationResult(req)`, invoke services, and return uniform HTTP status codes (`200`, `201`, `400`, `401`, `404`, `500`).
* **`services/`**: Encapsulate all business logic, data transformations, and database queries.
* **`models/`**: Define Mongoose schemas, types, indexes, and database-level validation.

---

## 5. UI/UX Direction & Frontend Standards

### Apple-Inspired Design Direction
* Visual quality is a top-tier requirement; the application should feel like a premium commercial product.
* Minimal and sophisticated layouts, excellent typography, refined spacing, and strong visual hierarchy.
* Elegant surfaces, refined shadows, depth, smooth transitions, and meaningful micro-interactions.
* Thoughtful empty, loading, and error states.
* Fully responsive across desktop, tablet, and mobile breakpoints.
* Avoid giant React components; break complex pages into clean, modular, reusable components.

### Non-Mandatory Material UI
* **Material UI is NOT mandatory.** Do not restrict the frontend to Material UI.
* Select the best implementation approach for each screen, leveraging modern CSS, CSS modules, Tailwind, Emotion, or suitable libraries when beneficial.
* Create and reuse cohesive design tokens (colors, typography, shadows, radii) and UI components.
* Avoid unnecessary dependencies.
* Do not copy proprietary Apple interfaces or assets; create an original visual identity inspired by Apple's design principles.
* When working with existing or new MUI components:
  * Adhere to MUI v9+ standards; **never pass deprecated top-level v5/v6 props** (`inputProps`, `InputProps`, `SelectProps`, `PaperProps`). Use `slotProps` (e.g. `slotProps={{ htmlInput: { ... } }}`).
  * Maintain strong contrast on dark surfaces (never default unstyled links to `#0000ee`).

### Forms & Accessibility
* Use `react-hook-form` for robust form state and validation.
* Provide proper accessibility attributes, including explicit `autocomplete` attributes on credentials fields (`current-password`, `new-password`, `email`).

---

## 6. Scope Boundaries & Out-of-Scope Safeguards

* **Never invent features or extrapolate unrequested functionality.**
* Strictly respect the out-of-scope boundaries defined in [`Product-Vision.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/requirements/Product-Vision.md):
  - Payments / monetization
  - Gym memberships
  - Trainer marketplace
  - Social feeds / networking
  - Wearable hardware integrations (Apple Health, Garmin, Fitbit)
  - Video streaming
  - Native mobile application builds
* Record valuable secondary ideas or deferred improvements in `docs/development/FUTURE_ENHANCEMENTS.md` instead of implementing them unprompted.

---

## 7. Strict External Tool Failure Policy

Distinguish between application code failures and external tool/environment failures:

### Application Code Failures
* Examples: syntax errors, React rendering bugs, API bugs caused by code, validation errors, database query bugs, broken user flows, test assertion failures.
* **Action**: Independently investigate root cause, fix code, rerun checks, verify fix, check for regressions. Do not ask the user to debug ordinary code issues.

### External Tool or Environment Failures
* Examples: Chrome DevTools MCP unavailable, browser automation failure, GitHub MCP failure, terminal execution failure, network sandbox blocking external MongoDB Atlas access, missing external credentials, host-level permission failure, dev server environment crash.
* **Mandatory Protocol**:
  1. **Stop** at the failed operation immediately.
  2. **Preserve** all completed work safely.
  3. **Never pretend** the operation succeeded.
  4. **Never skip** the required verification stage.
  5. **Never silently replace** a failed tool with an unapproved alternative.
  6. **Never substitute mocks** for real integration verification.
  7. **Never make destructive changes** to work around the failure.
  8. **Report** the exact tool, attempted operation, error, impact, and required human intervention.
* You may continue independent work only when it does not depend on the failed capability or invalidate required verification. Wait for the developer to resolve external blockers before retrying blocked operations.

---

## 8. Testing Infrastructure & Verification Standards

* Establish and maintain a robust, repeatable testing approach covering:
  - Frontend component behavior and interactions
  - Backend services and business logic
  - API endpoints, request validation, and HTTP status codes
  - Authentication and authorization rules
  - Real database persistence and data integrity
  - Important end-to-end user flows
* **Real Services for Integration**: Use real database connections and API services for integration verification. Mocks are permitted only for isolated unit tests and must never be represented as proof of real integration.
* **Live Browser Verification**:
  - Run the frontend development server and verify live behavior using `chrome-devtools` MCP directly.
  - Inspect layout and accessibility with `take_snapshot` and visual layout with `take_screenshot`.
  - Confirm **0 console errors** via `list_console_messages`.
  - Confirm **0 unexpected network failures** via `list_network_requests`.
* **Honest Quality Reporting**:
  - Categorize checks explicitly: **Passed**, **Failed**, **Blocked**, or **Not Configured / Not Run**.
  - Never claim complete testing merely because lint and build pass.

---

## 9. Autonomous Execution & Git Protocol

### Authorized Autonomous Workflow
The human developer pre-authorizes the standard routine feature workflow without requiring repeated confirmation:
1. Feature branch creation (`git checkout -b feature/<name>`)
2. Targeted implementation and refinement
3. Static checks, builds, tests, and live verification
4. Documentation synchronization
5. Working tree diff review and selective staging (`git add <files>`)
6. Conventional commit (`git commit -m "..."`)
7. Branch push (`git push -u origin feature/<name>`)
8. Pull request creation and PR updates
9. CI failure investigation and fixes
10. Advancing to the next independent roadmap feature on a new branch when safe

### Hard Safety Invariants
* **Never commit directly to `main`.**
* **Never force push (`git push --force`).**
* **Never reset or discard unrelated work (`git reset --hard`, `git clean -fd`).**
* **Never overwrite existing user modifications.**
* **Never stage everything blindly (`git add .` or `git add -A`); stage only relevant files.**
* **Never commit secrets or `.env` files.**
* **Never combine unrelated features in a single commit.**
* **Never claim a commit or push succeeded without tool verification.**
* **Never merge a pull request without explicit authorization from the developer.**

### PR & Commit Conventions
* Use professional Conventional Commits (`feat(...)`, `fix(...)`, `docs(...)`, `refactor(...)`, `test(...)`).
* PR descriptions must include: Summary, Implemented Capabilities, Technical Changes, Verification Performed (with screenshot references where useful), and Remaining Limitations.

---

## 10. Security, Secrets & Data Protection

* **Zero Hardcoded Secrets**: Never commit or expose API keys, database credentials, or JWT secrets in code, logs, or documentation.
* Configure via environment variables (`server/.env`).
* Never print complete environment variables or sensitive authentication payloads to terminal logs.
* Never use production data for destructive testing; use dedicated test accounts and clean up test records safely.
* Never delete existing user data or weaken authentication/authorization checks.

---

## 11. Professional Engineering Communication

* Maintain natural, professional engineering communication across commit messages, PR descriptions, documentation, and code comments.
* Describe the actual engineering work performed.
* Do not include artificial AI attribution, generator signatures, tool credits, or unnecessary references to development agents.
* Never falsely claim human authorship or misrepresent who performed the work; use objective, industry-standard engineering language.

---

## 12. Development Continuity

Before starting each new feature:
1. Inspect current Git status, branch, and recent commit history.
2. Review `docs/requirements/Features.md` and active sprint documentation.
3. Identify dependencies and select the next unfinished non-AI deliverable.
4. Verify workspace state to avoid repeating completed work or overwriting in-flight changes.
