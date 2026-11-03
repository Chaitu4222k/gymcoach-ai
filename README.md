# GymCoach AI

GymCoach AI is an intelligent, full-stack fitness and athletic coaching web application built to deliver personalized workout planning, live session tracking, performance analytics, and adaptive coaching.

---

## Architecture & Features

GymCoach AI is engineered as a decoupled monorepo following strict layered design patterns (`Route -> Validator -> Auth Middleware -> Controller -> Service -> Model`).

### Core Modules (Phase 1 Delivered)

* **Authentication & Authorization**: Secure JWT authentication, bcrypt password hashing, session persistence, protected routing, and credential management.
* **Athlete Profile**: Comprehensive profile schema tracking physical statistics, fitness goals, experience tiers, available equipment, and training schedules.
* **Exercise Catalog & Taxonomy**: Standard 40+ canonical exercise library, rich taxonomy (muscle groups, movement categories, difficulty, equipment constraints), user-owned custom exercise builder, and multi-parameter filtering.
* **Workout Routine Builder & Planner**: Interactive split builder, multi-day scheduling, rule-based starter routine recommendation engine tailored to user experience and equipment, and active split management.
* **Active Workout Logger & Live Tracker**: Real-time session tracker featuring elapsed workout timer, rest interval countdown timer, per-set weight/rep completion, and automatic tonnage volume calculation.
* **Workout History & Performance**: Historical session ledger with aggregate statistics (total sessions, volume tonnage, duration) and expandable set-level breakdowns.
* **Dashboard & Metrics Aggregator**: Centralized athlete hub displaying weekly cadence adherence, total tonnage, active split status, scheduled workout launcher, and recent training activity.
* **Progress & Body Metrics Analytics**: Body weight trajectory tracking with auto-profile sync, multi-week volume progression trends (4, 8, 12 weeks), and 30-day muscle group volume distribution.
* **Account Security & Preferences**: Secure password modification, application preferences (units, rest timer sounds, UI theme), and formal Phase 2 AI microservice boundary contracts.

---

## Technology Stack

### Frontend
* **Core**: React 19, Vite
* **UI & Styling**: Material UI (MUI v9+ `slotProps` architecture), Emotion, Apple-inspired custom dark surfaces
* **Forms & State**: React Hook Form, React Context API
* **Routing & HTTP**: React Router v7, Axios with interceptors

### Backend
* **Runtime**: Node.js & Express.js
* **Database & ODM**: MongoDB Atlas, Mongoose
* **Authentication**: JSON Web Tokens (JWT), bcrypt
* **Validation**: express-validator

### AI Service (Phase 2 Boundary)
* **Architecture**: Python FastAPI microservice architecture with structured input/output contracts.

---

## Upcoming Roadmap (Phase 2)

* **Collaborative AI Coach Integration**: Machine learning workout plan generator, dynamic progression adaptations, LLM conversational coaching assistant, and automated weekly progress evaluations.
