const test = require("node:test");
const assert = require("node:assert");
const { validationResult } = require("express-validator");

const {
  validateCreateWorkoutLog,
  validateLogIdParam,
  validateWorkoutQuery,
} = require("../src/validators/workoutLogValidator");

const getValidWorkoutPayload = () => ({
  routineName: "Upper / Lower Split",
  dayName: "Day 1: Upper Power",
  durationMinutes: 55,
  feeling: "Great",
  notes: "Felt strong on bench press today.",
  exercises: [
    {
      exerciseName: "Barbell Bench Press",
      primaryMuscle: "Chest",
      sets: [
        {
          setNumber: 1,
          reps: 8,
          weight: 80,
          completed: true,
        },
        {
          setNumber: 2,
          reps: 8,
          weight: 80,
          completed: true,
        },
        {
          setNumber: 3,
          reps: 7,
          weight: 80,
          completed: true,
        },
      ],
    },
  ],
});

async function runBodyValidation(rules, body, params = {}, query = {}) {
  const req = { body, params, query };
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
}

test("WorkoutLog Validator - accepts valid workout log payload", async () => {
  const result = await runBodyValidation(
    validateCreateWorkoutLog,
    getValidWorkoutPayload()
  );
  assert.strictEqual(result.isEmpty(), true, "Expected valid log to have 0 errors");
});

test("WorkoutLog Validator - enforces duration bounds (1-480 minutes)", async () => {
  const zeroDuration = await runBodyValidation(validateCreateWorkoutLog, {
    ...getValidWorkoutPayload(),
    durationMinutes: 0,
  });
  assert.strictEqual(zeroDuration.isEmpty(), false);
  assert.ok(zeroDuration.array().some((e) => e.path === "durationMinutes"));

  const tooLong = await runBodyValidation(validateCreateWorkoutLog, {
    ...getValidWorkoutPayload(),
    durationMinutes: 500,
  });
  assert.strictEqual(tooLong.isEmpty(), false);
  assert.ok(tooLong.array().some((e) => e.path === "durationMinutes"));
});

test("WorkoutLog Validator - requires at least one exercise", async () => {
  const emptyExercises = await runBodyValidation(validateCreateWorkoutLog, {
    ...getValidWorkoutPayload(),
    exercises: [],
  });
  assert.strictEqual(emptyExercises.isEmpty(), false);
  assert.ok(emptyExercises.array().some((e) => e.path === "exercises"));
});

test("WorkoutLog Validator - requires exerciseName and at least one set per exercise", async () => {
  const missingExName = await runBodyValidation(validateCreateWorkoutLog, {
    ...getValidWorkoutPayload(),
    exercises: [
      {
        exerciseName: "",
        sets: [{ setNumber: 1, reps: 10, weight: 50 }],
      },
    ],
  });
  assert.strictEqual(missingExName.isEmpty(), false);

  const emptySets = await runBodyValidation(validateCreateWorkoutLog, {
    ...getValidWorkoutPayload(),
    exercises: [
      {
        exerciseName: "Squat",
        sets: [],
      },
    ],
  });
  assert.strictEqual(emptySets.isEmpty(), false);
});

test("WorkoutLog Validator - enforces set reps bounds (0-200) and weight bounds (0-1000)", async () => {
  const negativeReps = await runBodyValidation(validateCreateWorkoutLog, {
    ...getValidWorkoutPayload(),
    exercises: [
      {
        exerciseName: "Squat",
        sets: [{ setNumber: 1, reps: -1, weight: 50 }],
      },
    ],
  });
  assert.strictEqual(negativeReps.isEmpty(), false);

  const excessiveWeight = await runBodyValidation(validateCreateWorkoutLog, {
    ...getValidWorkoutPayload(),
    exercises: [
      {
        exerciseName: "Squat",
        sets: [{ setNumber: 1, reps: 10, weight: 1500 }],
      },
    ],
  });
  assert.strictEqual(excessiveWeight.isEmpty(), false);
});

test("WorkoutLog Validator - validates feeling enum", async () => {
  const invalidFeeling = await runBodyValidation(validateCreateWorkoutLog, {
    ...getValidWorkoutPayload(),
    feeling: "Invincible",
  });
  assert.strictEqual(invalidFeeling.isEmpty(), false);
  assert.ok(invalidFeeling.array().some((e) => e.path === "feeling"));
});

test("WorkoutLog Validator - validateLogIdParam requires valid mongo ID", async () => {
  const invalidId = await runBodyValidation(
    validateLogIdParam,
    {},
    { id: "not-a-valid-id" }
  );
  assert.strictEqual(invalidId.isEmpty(), false);
  assert.ok(invalidId.array().some((e) => e.path === "id"));

  const validId = await runBodyValidation(
    validateLogIdParam,
    {},
    { id: "507f1f77bcf86cd799439011" }
  );
  assert.strictEqual(validId.isEmpty(), true);
});

test("WorkoutLog Validator - validateWorkoutQuery validates limit and page numbers", async () => {
  const validQuery = await runBodyValidation(
    validateWorkoutQuery,
    {},
    {},
    { limit: "15", page: "2" }
  );
  assert.strictEqual(validQuery.isEmpty(), true);

  const invalidLimit = await runBodyValidation(
    validateWorkoutQuery,
    {},
    {},
    { limit: "500" }
  );
  assert.strictEqual(invalidLimit.isEmpty(), false);
});
