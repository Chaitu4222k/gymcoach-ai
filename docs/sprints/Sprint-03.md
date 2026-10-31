# Sprint 03

## Objective

Implement a comprehensive User Profile module including full-stack persistence, validation, and an Apple-inspired modal UI for managing user fitness metrics.

## Completed

### Backend
* Profile Mongoose model (`Profile.js`) with validations and relational binding to `User`
* Complete CRUD endpoints:
  * `POST /api/profile` — Profile creation
  * `GET /api/profile` — Authenticated profile retrieval
  * `PUT /api/profile` — Profile mutation
  * `DELETE /api/profile` — Permanent profile deletion
* Express validator chains (`profileValidator.js`) covering:
  * Height (100–250 cm)
  * Weight (25–350 kg)
  * Fitness Goal (enum)
  * Experience (0–600 months)
  * Workout Location (enum)
  * Workout Days Per Week (1–7 days)
  * Workout Duration (15–180 minutes)
  * Diet Preference (enum)
  * Average Sleep Hours (1–16 hours)
  * Activity Level (enum)
  * Available Equipment (array of validated equipment enums)
* Automated validation test suite using Node.js native test runner (`node --test test/profileValidator.test.js`)

### Frontend
* Profile container and state management (`ProfileContainer.jsx`)
* Profile modal dialog with responsive sizing and scroll container (`ProfileModal.jsx`, `AppModal.jsx`)
* Profile view mode displaying user metrics, contact details, and equipment tags (`ProfileView.jsx`)
* Profile form mode with field-level validations and error messaging (`ProfileForm.jsx`)
* Dynamic equipment selector shown when workout location is "Home" or "Both"
* Confirmation dialog for permanent profile deletion
* Seamless integration into Dashboard with modal triggers (`Dashboard.jsx`)
* MUI v9 `slotProps` architecture across all form and modal components
* Accessible form attributes (`autoComplete`) and contrast enhancement on dark surfaces

### Verification & Infrastructure
* Automated backend unit testing: 10/10 tests passing
* Production build verified clean (`vite build`)
* Linter verified clean (`eslint .`)
* End-to-end MongoDB Atlas live persistence, mutation, restart persistence, and deletion verified

## Outcome

The User Profile module is complete, verified against real database persistence, and ready to serve as the personalized foundation for the Sprint 4 Workout Engine.

## Status

Feature Complete
