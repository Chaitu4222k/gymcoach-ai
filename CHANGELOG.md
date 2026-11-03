# Changelog

## Sprint 4 - Workout Engine (In Progress)

### Added

* Comprehensive Exercise catalog schema with muscle groups, categories, difficulty levels, and equipment constraints
* Standard exercise library with 40+ canonical movements seeded automatically upon startup
* User-owned custom exercise creation and deletion endpoints with strict ownership authorization
* Exercise filtering by primary muscle, equipment, category, difficulty, custom ownership, and case-insensitive search
* Backend automated validation test suite (`server/test/exerciseValidator.test.js`) with 100% pass rate
* Apple-inspired Exercise Library UI: `ExerciseExplorer`, `ExerciseCard`, `ExerciseFilters`, `ExerciseDetailModal`, and `CustomExerciseModal`
* Workout Routine model (`WorkoutRoutine.js`) supporting customizable training splits, scheduled days, and exercise parameters
* Full REST API for workout routines (`/api/workouts/routines`) including active routine toggling and ownership protection
* Deterministic rule-based starter routine recommendation engine (`/api/workouts/routines/recommendations`) tailored to user profile metrics
* Automated test suite for workout routine validation rules (`server/test/routineValidator.test.js`)
* Apple-inspired Workout Planner UI suite: `RoutineManager`, `RoutineCard`, `RoutineDaySchedule`, `RoutineBuilderModal`, and `StarterRecommendationModal`
* Dashboard entry points for Exercise Library and Workout Planner

## Sprint 3 - User Profile Module

### Added

* User Profile CRUD API with Mongoose persistence and relational binding to User
* Comprehensive input validation covering physical metrics, habits, and equipment
* Automated backend unit test suite for profile validation rules and enums (`server/test/profileValidator.test.js`)
* Apple-inspired Profile modal dialog architecture with view and edit modes
* Profile deletion flow with confirmation dialog
* Dynamic equipment selector for Home and Both workout locations
* Sprint 3 User Profile documentation and roadmap synchronization

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
