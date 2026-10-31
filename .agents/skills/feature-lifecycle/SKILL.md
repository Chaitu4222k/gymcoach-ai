---
name: feature-lifecycle
description: >-
  Executes the full end-to-end 9-step feature delivery lifecycle in GymCoach AI. Use this skill
  whenever implementing, extending, or verifying a feature across the frontend, backend,
  database, UI/UX, or documentation. It guides requirement inspection, planning, Apple-inspired
  UI/UX design, layered implementation, comprehensive testing (frontend, backend, real DB),
  independent debugging, documentation sync, autonomous Git workflow, and structured completion reporting.
---

# GymCoach AI — End-to-End Feature Development Lifecycle

This skill defines the canonical 9-step autonomous lifecycle for delivering portfolio-grade, non-AI features across GymCoach AI during Phase 1.

---

## Step 1: Requirements & Inspection

Before modifying or creating any code:
1. **Authoritative Sources**:
   - Check [`docs/requirements/Features.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/requirements/Features.md) for the active sprint backlog and task status.
   - Review [`docs/requirements/Product-Vision.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/requirements/Product-Vision.md), [`docs/requirements/User-Flows.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/requirements/User-Flows.md), and [`docs/requirements/API-Overview.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/requirements/API-Overview.md).
   - Review relevant sprint files in `docs/sprints/`.
2. **Current Codebase & Git Inspection**:
   - Check current git branch, uncommitted diffs, and recent commits (`git status`, `git log -n 5`).
   - Inspect existing routes, controllers, services, models, components, and contexts.
   - Never assume a feature is incomplete based solely on a checklist; inspect implementation first.
   - Identify dependencies and confirm whether the feature involves pending AI touchpoints.

---

## Step 2: Planning

Formulate a concise, actionable technical plan:
* **Scope**: Identify exact deliverables across frontend, backend, and database.
* **Architecture & Contracts**: Define API routes, request/response JSON schemas, and Mongoose schema updates.
* **Validation & Security**: Specify `express-validator` rules, authentication middleware, and authorization constraints.
* **AI Boundaries (if applicable)**:
  - If a feature has an AI dependency, implement complete non-AI infrastructure.
  - Define clear contracts for AI inputs and outputs.
  - Mark the feature explicitly as AI-pending; **never fake AI behavior with mocks**.
* **Test Scenarios**: Identify unit, API, integration, and browser interaction test paths.

---

## Step 3: UI/UX Design (Apple-Inspired Direction)

Design a premium, commercial-grade user experience:
* **Visual Language**:
  - Minimalist and sophisticated layouts inspired by Apple's design principles.
  - Generous spacing, strong visual hierarchy, and elegant typography.
  - Refined surfaces, subtle borders, dark theme depth, and tasteful shadows.
  - Smooth transitions and meaningful micro-interactions.
* **Implementation Freedom**:
  - **Material UI is NOT mandatory.** Choose the best approach (modern CSS, CSS modules, Tailwind, Emotion, or appropriate UI libraries).
  - If utilizing MUI components, adhere strictly to MUI v9 (`slotProps`, no deprecated props).
  - Ensure high contrast on dark backgrounds (never default unstyled links to blue `#0000ee`).
* **Component Architecture**:
  - Avoid monolithic React components; break complex pages into modular, reusable components.
  - Provide polished loading, empty, and error states.
* **Responsiveness & Accessibility**:
  - Verify layout across mobile, tablet, and desktop breakpoints.
  - Include explicit form attributes (`autocomplete`, accessible labels, keyboard navigation).

---

## Step 4: Implementation

Implement the complete non-AI feature adhering to monorepo and layered architecture:
* **Backend Layering (`server/src/`)**:
  ```
  Route ──> Validator ──> Auth Middleware ──> Controller ──> Service ──> Model
  ```
  1. `validators/`: Input validation chains using `express-validator`.
  2. `routes/`: Mount endpoints and bind validators, auth middleware, and controllers.
  3. `controllers/`: Check `validationResult(req)`, invoke services, return uniform status codes.
  4. `services/`: Encapsulate business logic, transformations, and database queries.
  5. `models/`: Mongoose schemas, indexes, and schema validations.
* **Frontend (`client/src/`)**:
  - Manage form state and validation using `react-hook-form`.
  - Use `apiClient` Axios instance with automatic JWT Bearer token attachment.
  - Manage application state via appropriate React contexts (`AuthContext`, `ToastContext`).
  - Preserve unrelated code, existing comments, and working behavior.

---

## Step 5: Testing & Verification

Execute comprehensive testing across all tiers:

### 1. Frontend Checks
* **Static Analysis**: `npm --prefix client run lint` (resolve all errors and warnings).
* **Production Build**: `npm --prefix client run build` (ensure clean compilation).
* **Component & Interaction Tests**: Run configured unit/component tests.

### 2. Backend Checks
* **Syntax / Static Checks**: `node -c server/src/index.js`.
* **API & Service Tests**: Run backend test suites covering endpoint status codes, validation errors, and authorization.

### 3. Real Database & Service Integration
* Test real database persistence against MongoDB Atlas (or local MongoDB when configured).
* Verify document creation, retrieval, mutation, restart persistence, and safe deletion.
* **Rule**: Mocks may be used for isolated unit tests, but must never be represented as proof of real integration.

### 4. Live Browser Verification via Chrome DevTools MCP
* Start Vite server (`npm --prefix client run dev` as a daemon).
* Use `chrome-devtools` MCP tools directly (do not invoke `/browser` subagent):
  1. `navigate_page` to target route (`http://localhost:5173`).
  2. `take_snapshot` to inspect DOM accessibility tree and element UIDs.
  3. `take_screenshot` to visually inspect typography, spacing, depth, and responsive layouts.
  4. `list_console_messages` to confirm **0 JavaScript errors** and 0 React DOM attribute warnings.
  5. `list_network_requests` to ensure no unexpected 4xx/5xx responses or broken asset requests.
  6. Exercise form submissions, modals, and edge cases via `click`, `fill_form`, or `type_text`.

---

## Step 6: Debugging & Strict Tool Failure Handling

### Application Code Failures
* For syntax errors, React rendering bugs, API failures, database errors, or broken flows:
  - Independently investigate root cause in code and logs.
  - Apply targeted fixes without unrelated changes.
  - Rerun checks, verify fixes, and ensure no regressions.
  - Do not ask the developer to debug normal code issues.

### External Tool or Environment Failures
* If Chrome DevTools MCP, GitHub MCP, MongoDB Atlas connectivity, network sandbox, or dev server fails:
  - **Stop** immediately at the failed operation.
  - **Preserve** all completed work safely.
  - **Never pretend** the operation succeeded or skip verification.
  - **Never replace** real integration verification with mocks.
  - **Report** the exact tool, attempted operation, error, impact, and required human intervention.

---

## Step 7: Documentation Synchronization

Update only documentation affected by the feature:
1. [`docs/requirements/Features.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/requirements/Features.md): Mark completed items with `[x]`.
2. [`CHANGELOG.md`](file:///Users/chaitanya/Projects/gymcoach-ai/CHANGELOG.md): Add concise entries under the appropriate Sprint section (`Added`, `Improved`, `Security`).
3. [`docs/requirements/API-Overview.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/requirements/API-Overview.md): Keep API route table in sync if endpoints were added or modified.
4. [`docs/requirements/User-Flows.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/requirements/User-Flows.md) or [`System-Architecture.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/requirements/System-Architecture.md): Update if architectural flow changed.
5. [`docs/development/FUTURE_ENHANCEMENTS.md`](file:///Users/chaitanya/Projects/gymcoach-ai/docs/development/FUTURE_ENHANCEMENTS.md): Record any deferred product ideas.

---

## Step 8: Autonomous Git Workflow

Execute routine Git operations autonomously without prompting for confirmation:
1. **Dedicated Feature Branch**: Ensure work is on `feature/<name>` (never work directly on `main`).
2. **Review Diff**: Run `git diff` and `git status` to verify only intended files are changed.
3. **Selective Staging**: Stage specific modified/untracked files using `git add <files>` (never use blind `git add .`).
4. **Conventional Commit**: Commit with standard conventional commit message (`feat(...)`, `fix(...)`, `docs(...)`).
5. **Branch Push**: Push the branch to remote (`git push -u origin feature/<name>`).
6. **Pull Request**: Create a PR with title, summary, features built, verification evidence, and limitations.
7. **Hard Rules**:
   - Never commit directly to `main`.
   - Never force push (`--force`).
   - Never reset or discard uncommitted user changes.
   - Never commit secrets or `.env` files.
   - Never merge a PR without explicit developer approval.
8. **Continuity**: Once the PR is created, advance to the next independent roadmap feature on a new branch if safe.

---

## Step 9: Structured Completion Report

Conclude each feature with a clear, professional report:
1. **Feature Summary**: Concise description of what was built.
2. **Frontend Implementation**: Components created/modified, UI patterns, styling approach.
3. **Backend Implementation**: Routes, validators, controllers, services, models.
4. **Database Changes**: Schema updates, indexes, persistence verified.
5. **Testing & Verification Results**:
   - Lint & build status.
   - Test suites executed (or honest status if not configured).
   - Chrome DevTools MCP verification: console errors (0), network requests (0 failed), screenshot references.
   - Real database persistence status.
6. **Documentation Updates**: Links to updated documentation files.
7. **Git Details**: Branch name, commit hash, pull request URL (or push status).
8. **Remaining Limitations / AI-Pending Contracts**: Explicitly state any pending AI touchpoints or external dependencies.
