# Changelog

## User Settings, Account Security & AI Architecture Module

### Added

* Password modification endpoint (`PUT /api/auth/password`) with bcrypt old-password verification and strength checks
* User preferences persistence schema and endpoint (`PUT /api/profile/preferences`) supporting weight units, rest timer audio alerts, and theme preferences
* Formal HTTP 501 Phase 2 AI microservice boundary endpoints (`/api/ai/generate-plan`, `/api/ai/chat`, `/api/ai/daily-summary`, `/api/ai/insights`) returning explicit contract payloads without mocks
* Automated backend unit test suite (`server/test/authValidator.test.js`) verifying password mutation validation
* Apple-inspired `SettingsModal` UI providing Account Security, User Preferences, and Phase 2 AI Architecture Boundary overview

## Performance & Progress Analytics Module

### Added

* Body Weight Tracking schema (`BodyWeightLog.js`) with automatic synchronization to active user profile
* Body weight endpoints (`/api/progress/weight`) providing starting/current weight, net change, and low/high range analytics
* Weekly volume progression analytics engine (`/api/progress/volume`) with configurable 4, 8, and 12-week timeframes
* 30-day muscle group volume distribution analytics engine (`/api/progress/muscles`) tracking training balance
* Automated unit test suite (`server/test/progressValidator.test.js`) covering body weight bounds and query parameters
* Apple-inspired `ProgressModal` UI featuring Body Weight Trajectory, Volume Progression Bars, and Muscular Balance distribution

## Dashboard & Analytics Module

### Added

* Aggregated dashboard overview API (`/api/dashboard`) returning athlete summary, weekly cadence progress, total volume, and active routine status
* Apple-inspired full Dashboard experience replacing legacy placeholder
* `MetricCardsGrid` displaying weekly workout cadence progress, total tonnage, all-time sessions, and active split badge
* `ActiveSplitWidget` featuring automated today's scheduled split detection, rest day guidance, and one-click workout launcher
* `RecentActivityWidget` with chronological session cards and duration/volume badges
* `QuickNavGrid` providing fast access to Workout Planner, Exercise Library, Workout History, and Athlete Profile

## Sprint 4 - Workout Engine

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
* Daily Workout Log persistence model (`WorkoutLog.js`) with automatic volume calculation in kilograms
* Workout Session Logging and History API (`/api/workouts`, `/api/workouts/history`) with performance aggregation
* Automated test suite for workout logging validation rules (`server/test/workoutLogValidator.test.js`)
* Interactive Active Workout Tracker UI (`ActiveWorkoutModal`) featuring live elapsed workout timer, rest interval countdown timer, and interactive set completion tracking
* Workout History viewer UI (`WorkoutHistoryModal`) with aggregate statistics bar (total sessions, weekly count, total tonnage, hours) and expandable set-level breakdowns
* Dashboard entry points for Start Live Workout and Workout History

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
