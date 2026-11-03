# API Overview

## Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

---

## Profile

POST /api/profile

GET /api/profile

PUT /api/profile

DELETE /api/profile

---

## Exercises

GET /api/exercises/options

GET /api/exercises

GET /api/exercises/:id

POST /api/exercises

DELETE /api/exercises/:id

---

## Workout Routines & Planner

GET /api/workouts/routines/recommendations

GET /api/workouts/routines/active

GET /api/workouts/routines

GET /api/workouts/routines/:id

POST /api/workouts/routines

PUT /api/workouts/routines/:id

PUT /api/workouts/routines/:id/active

DELETE /api/workouts/routines/:id

---

## Workout Tracking & Sessions

POST /api/workouts

GET /api/workouts

GET /api/workouts/history

---

## Dashboard

GET /api/dashboard

---

## AI

POST /api/ai/generate-plan

POST /api/ai/chat

GET /api/ai/daily-summary

GET /api/ai/insights
