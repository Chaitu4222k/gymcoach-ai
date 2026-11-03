const test = require("node:test");
const assert = require("node:assert");
const { validationResult } = require("express-validator");

const {
  validateCreateRoutine,
  validateUpdateRoutine,
} = require("../src/validators/routineValidator");

const getValidRoutinePayload = () => ({
  name: "Upper / Lower Split",
  description: "A balanced 4-day hypertrophy program",
  goal: "Build Muscle",
  difficulty: "Intermediate",
  daysPerWeek: 4,
  days: [
    {
      dayNumber: 1,
      name: "Upper Power",
      targetMuscleGroups: ["Chest", "Back"],
      isRestDay: false,
      exercises: [
        {
          exerciseName: "Barbell Bench Press",
          targetSets: 4,
          targetRepsMin: 6,
          targetRepsMax: 8,
          restSeconds: 120,
          notes: "Explosive concentric phase",
        },
      ],
    },
    {
      dayNumber: 2,
      name: "Rest Day",
      isRestDay: true,
      exercises: [],
    },
  ],
});

async function runBodyValidation(rules, body, params = {}) {
  const req = { body, params, query: {} };
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
}

test("Routine Validator - accepts valid routine payload", async () => {
  const result = await runBodyValidation(
    validateCreateRoutine,
    getValidRoutinePayload()
  );
  assert.strictEqual(result.isEmpty(), true, "Expected valid routine to have 0 errors");
});

test("Routine Validator - enforces name presence and bounds (2-100 chars)", async () => {
  const emptyName = await runBodyValidation(validateCreateRoutine, {
    ...getValidRoutinePayload(),
    name: "",
  });
  assert.strictEqual(emptyName.isEmpty(), false);
  assert.ok(emptyName.array().some((e) => e.path === "name"));

  const tooLong = await runBodyValidation(validateCreateRoutine, {
    ...getValidRoutinePayload(),
    name: "R".repeat(101),
  });
  assert.strictEqual(tooLong.isEmpty(), false);
});

test("Routine Validator - enforces daysPerWeek range (1-7)", async () => {
  const zeroDays = await runBodyValidation(validateCreateRoutine, {
    ...getValidRoutinePayload(),
    daysPerWeek: 0,
  });
  assert.strictEqual(zeroDays.isEmpty(), false);
  assert.ok(zeroDays.array().some((e) => e.path === "daysPerWeek"));

  const eightDays = await runBodyValidation(validateCreateRoutine, {
    ...getValidRoutinePayload(),
    daysPerWeek: 8,
  });
  assert.strictEqual(eightDays.isEmpty(), false);
  assert.ok(eightDays.array().some((e) => e.path === "daysPerWeek"));
});

test("Routine Validator - validates fitness goal enum", async () => {
  const invalidGoal = await runBodyValidation(validateCreateRoutine, {
    ...getValidRoutinePayload(),
    goal: "Not A Real Goal",
  });
  assert.strictEqual(invalidGoal.isEmpty(), false);
  assert.ok(invalidGoal.array().some((e) => e.path === "goal"));
});

test("Routine Validator - validates difficulty enum", async () => {
  const invalidDifficulty = await runBodyValidation(validateCreateRoutine, {
    ...getValidRoutinePayload(),
    difficulty: "Superhero",
  });
  assert.strictEqual(invalidDifficulty.isEmpty(), false);
  assert.ok(invalidDifficulty.array().some((e) => e.path === "difficulty"));
});

test("Routine Validator - validates exercise target sets, reps, and rest seconds", async () => {
  const invalidSets = await runBodyValidation(validateCreateRoutine, {
    ...getValidRoutinePayload(),
    days: [
      {
        dayNumber: 1,
        name: "Leg Day",
        exercises: [
          {
            exerciseName: "Squat",
            targetSets: 25, // Max 20
            targetRepsMin: 8,
            targetRepsMax: 12,
            restSeconds: 90,
          },
        ],
      },
    ],
  });
  assert.strictEqual(invalidSets.isEmpty(), false);

  const invalidRest = await runBodyValidation(validateCreateRoutine, {
    ...getValidRoutinePayload(),
    days: [
      {
        dayNumber: 1,
        name: "Leg Day",
        exercises: [
          {
            exerciseName: "Squat",
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 12,
            restSeconds: 10, // Min 15
          },
        ],
      },
    ],
  });
  assert.strictEqual(invalidRest.isEmpty(), false);
});

test("Routine Validator - validateUpdateRoutine requires valid mongo ID parameter", async () => {
  const invalidId = await runBodyValidation(
    validateUpdateRoutine,
    getValidRoutinePayload(),
    { id: "invalid-id-string" }
  );
  assert.strictEqual(invalidId.isEmpty(), false);
  assert.ok(invalidId.array().some((e) => e.path === "id"));

  const validId = await runBodyValidation(
    validateUpdateRoutine,
    getValidRoutinePayload(),
    { id: "507f1f77bcf86cd799439011" }
  );
  assert.strictEqual(validId.isEmpty(), true, "Expected valid mongo ID to pass");
});
