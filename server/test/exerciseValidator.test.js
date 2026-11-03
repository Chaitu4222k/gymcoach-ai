const test = require("node:test");
const assert = require("node:assert");
const { validationResult } = require("express-validator");

const {
  validateCreateExercise,
  validateExerciseQuery,
} = require("../src/validators/exerciseValidator");

const getValidExercisePayload = () => ({
  name: "Incline Dumbbell Press",
  category: "Hypertrophy",
  primaryMuscle: "Chest",
  secondaryMuscles: ["Shoulders", "Triceps"],
  equipment: "Dumbbells",
  difficulty: "Intermediate",
  instructions: [
    "Set bench to 30 degrees",
    "Press dumbbells upward under control",
  ],
});

async function runBodyValidation(rules, body) {
  const req = { body, query: {}, params: {} };
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
}

async function runQueryValidation(rules, query) {
  const req = { body: {}, query, params: {} };
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
}

test("Exercise Validator - accepts a valid exercise creation payload", async () => {
  const result = await runBodyValidation(
    validateCreateExercise,
    getValidExercisePayload()
  );
  assert.strictEqual(result.isEmpty(), true, "Expected valid exercise to have 0 errors");
});

test("Exercise Validator - requires exercise name and enforces length bounds (2-100)", async () => {
  const missingName = await runBodyValidation(validateCreateExercise, {
    ...getValidExercisePayload(),
    name: "",
  });
  assert.strictEqual(missingName.isEmpty(), false);
  assert.ok(missingName.array().some((e) => e.path === "name"));

  const tooShort = await runBodyValidation(validateCreateExercise, {
    ...getValidExercisePayload(),
    name: "A",
  });
  assert.strictEqual(tooShort.isEmpty(), false);

  const tooLong = await runBodyValidation(validateCreateExercise, {
    ...getValidExercisePayload(),
    name: "A".repeat(101),
  });
  assert.strictEqual(tooLong.isEmpty(), false);
});

test("Exercise Validator - validates category from permitted enum values", async () => {
  const invalidCategory = await runBodyValidation(validateCreateExercise, {
    ...getValidExercisePayload(),
    category: "Extreme Power",
  });
  assert.strictEqual(invalidCategory.isEmpty(), false);
  assert.ok(invalidCategory.array().some((e) => e.path === "category"));
});

test("Exercise Validator - validates primary muscle from permitted enum values", async () => {
  const invalidMuscle = await runBodyValidation(validateCreateExercise, {
    ...getValidExercisePayload(),
    primaryMuscle: "Neck",
  });
  assert.strictEqual(invalidMuscle.isEmpty(), false);
  assert.ok(invalidMuscle.array().some((e) => e.path === "primaryMuscle"));
});

test("Exercise Validator - validates secondary muscles array and values", async () => {
  const invalidType = await runBodyValidation(validateCreateExercise, {
    ...getValidExercisePayload(),
    secondaryMuscles: "Chest",
  });
  assert.strictEqual(invalidType.isEmpty(), false);

  const invalidEntry = await runBodyValidation(validateCreateExercise, {
    ...getValidExercisePayload(),
    secondaryMuscles: ["Chest", "UnknownMuscle"],
  });
  assert.strictEqual(invalidEntry.isEmpty(), false);
});

test("Exercise Validator - validates equipment from permitted enum values", async () => {
  const invalidEquipment = await runBodyValidation(validateCreateExercise, {
    ...getValidExercisePayload(),
    equipment: "Tractor Tire",
  });
  assert.strictEqual(invalidEquipment.isEmpty(), false);
  assert.ok(invalidEquipment.array().some((e) => e.path === "equipment"));
});

test("Exercise Validator - validates optional difficulty", async () => {
  const invalidDifficulty = await runBodyValidation(validateCreateExercise, {
    ...getValidExercisePayload(),
    difficulty: "Master",
  });
  assert.strictEqual(invalidDifficulty.isEmpty(), false);
  assert.ok(invalidDifficulty.array().some((e) => e.path === "difficulty"));
});

test("Exercise Validator - validates query filters (category, muscle, equipment, difficulty, search)", async () => {
  const validQuery = await runQueryValidation(validateExerciseQuery, {
    primaryMuscle: "Chest",
    equipment: "Dumbbells",
    category: "Hypertrophy",
    difficulty: "Beginner",
    search: "press",
  });
  assert.strictEqual(validQuery.isEmpty(), true, "Expected valid query to pass");

  const invalidMuscleQuery = await runQueryValidation(validateExerciseQuery, {
    primaryMuscle: "InvalidGroup",
  });
  assert.strictEqual(invalidMuscleQuery.isEmpty(), false);
  assert.ok(invalidMuscleQuery.array().some((e) => e.path === "primaryMuscle"));

  const invalidSearch = await runQueryValidation(validateExerciseQuery, {
    search: "S".repeat(105),
  });
  assert.strictEqual(invalidSearch.isEmpty(), false);
  assert.ok(invalidSearch.array().some((e) => e.path === "search"));
});
