# Changelog

## Sprint 3 - User Profile Module

### Added

* Profile deletion flow with confirmation dialog in Profile modal
* Destructive profile delete trigger integrated with backend DELETE endpoint
* Automated backend unit test suite for profile validation rules and enums (`server/test/profileValidator.test.js`)
* Autonomous development environment validation (Antigravity CLI, AGENTS.md, feature-lifecycle skill, Chrome DevTools MCP, GitHub MCP)
* Live MongoDB Atlas end-to-end database persistence and restart lifecycle verification
* Sprint 3 User Profile sprint documentation and roadmap synchronization

### Improved

* Migrated form and modal components to MUI v9 `slotProps` architecture
* Added explicit `autocomplete` attributes to authentication credentials fields
* Enhanced link contrast on dark authentication surfaces

## Sprint 2 - Authentication Module

### Added

* User Registration API
* User Login API
* JWT Authentication
* Password hashing using bcrypt
* MongoDB integration
* Authentication Context
* Session persistence using localStorage
* Protected Routes
* Public Routes
* Dashboard placeholder
* Reusable API client with Axios interceptor
* Centralized API routes configuration
* Reusable UI components:

  * AppButton
  * AppTextField
  * PasswordField
  * AppCard
  * PageContainer
  * AuthLayout
* MUI dark theme
* Form validation using react-hook-form

### Improved

* Centralized API endpoint management
* Reusable authentication layout
* Theme-based styling
* Authentication architecture
* Project folder organization

### Security

* Password hashing with bcrypt
* JWT-based authentication
* Backend request validation
* Protected client-side routing
