const test = require("node:test");
const assert = require("node:assert");
const { validationResult } = require("express-validator");

const {
  validateCreateProfile,
  validateUpdateProfile,
} = require("../src/validators/profileValidator");
const {
  FITNESS_GOALS,
  WORKOUT_LOCATIONS,
  DIET_PREFERENCES,
  ACTIVITY_LEVELS,
  AVAILABLE_EQUIPMENT,
} = require("../src/constants/profileConstants");

const getValidProfilePayload = () => ({
  height: 175,
  weight: 72,
  fitnessGoal: "Build Muscle",
  experienceMonths: 18,
  workoutLocation: "Gym",
  workoutDaysPerWeek: 4,
  workoutDuration: 60,
  dietPreference: "Non-Vegetarian",
  averageSleepHours: 7.5,
  activityLevel: "Moderately Active",
  availableEquipment: ["Dumbbells", "Barbell"],
});

async function runValidation(rules, body) {
  const req = { body };
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
}

test("Profile Validator - accepts valid profile payload", async () => {
  const result = await runValidation(validateCreateProfile, getValidProfilePayload());
  assert.strictEqual(result.isEmpty(), true, "Expected valid profile to have 0 errors");
});

test("Profile Validator - enforces height bounds (100-250 cm)", async () => {
  const tooShort = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    height: 99,
  });
  assert.strictEqual(tooShort.isEmpty(), false);
  assert.strictEqual(tooShort.array()[0].path, "height");

  const tooTall = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    height: 251,
  });
  assert.strictEqual(tooTall.isEmpty(), false);
  assert.strictEqual(tooTall.array()[0].path, "height");

  const minValid = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    height: 100,
  });
  assert.strictEqual(minValid.isEmpty(), true);

  const maxValid = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    height: 250,
  });
  assert.strictEqual(maxValid.isEmpty(), true);
});

test("Profile Validator - enforces weight bounds (25-350 kg)", async () => {
  const tooLight = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    weight: 24,
  });
  assert.strictEqual(tooLight.isEmpty(), false);

  const tooHeavy = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    weight: 351,
  });
  assert.strictEqual(tooHeavy.isEmpty(), false);

  const validWeight = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    weight: 75,
  });
  assert.strictEqual(validWeight.isEmpty(), true);
});

test("Profile Validator - validates fitnessGoal enum values", async () => {
  const invalidGoal = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    fitnessGoal: "Invalid Goal",
  });
  assert.strictEqual(invalidGoal.isEmpty(), false);

  for (const goal of FITNESS_GOALS) {
    const valid = await runValidation(validateCreateProfile, {
      ...getValidProfilePayload(),
      fitnessGoal: goal,
    });
    assert.strictEqual(valid.isEmpty(), true, `Expected goal ${goal} to be valid`);
  }
});

test("Profile Validator - validates workoutLocation enum values", async () => {
  const invalidLocation = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    workoutLocation: "Outdoors",
  });
  assert.strictEqual(invalidLocation.isEmpty(), false);

  for (const loc of WORKOUT_LOCATIONS) {
    const valid = await runValidation(validateCreateProfile, {
      ...getValidProfilePayload(),
      workoutLocation: loc,
    });
    assert.strictEqual(valid.isEmpty(), true, `Expected location ${loc} to be valid`);
  }
});

test("Profile Validator - enforces workout days bounds (1-7)", async () => {
  const zeroDays = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    workoutDaysPerWeek: 0,
  });
  assert.strictEqual(zeroDays.isEmpty(), false);

  const eightDays = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    workoutDaysPerWeek: 8,
  });
  assert.strictEqual(eightDays.isEmpty(), false);

  const fourDays = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    workoutDaysPerWeek: 4,
  });
  assert.strictEqual(fourDays.isEmpty(), true);
});

test("Profile Validator - enforces workout duration (15-180 mins)", async () => {
  const shortDuration = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    workoutDuration: 10,
  });
  assert.strictEqual(shortDuration.isEmpty(), false);

  const longDuration = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    workoutDuration: 200,
  });
  assert.strictEqual(longDuration.isEmpty(), false);

  const validDuration = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    workoutDuration: 45,
  });
  assert.strictEqual(validDuration.isEmpty(), true);
});

test("Profile Validator - validates dietPreference enum values", async () => {
  const invalidDiet = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    dietPreference: "Fruitarian",
  });
  assert.strictEqual(invalidDiet.isEmpty(), false);

  for (const diet of DIET_PREFERENCES) {
    const valid = await runValidation(validateCreateProfile, {
      ...getValidProfilePayload(),
      dietPreference: diet,
    });
    assert.strictEqual(valid.isEmpty(), true);
  }
});

test("Profile Validator - validates activityLevel enum values", async () => {
  const invalidLevel = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    activityLevel: "Super Active",
  });
  assert.strictEqual(invalidLevel.isEmpty(), false);

  for (const level of ACTIVITY_LEVELS) {
    const valid = await runValidation(validateCreateProfile, {
      ...getValidProfilePayload(),
      activityLevel: level,
    });
    assert.strictEqual(valid.isEmpty(), true);
  }
});

test("Profile Validator - validates equipment selection list", async () => {
  const invalidItem = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    availableEquipment: ["Dumbbells", "Magic Wand"],
  });
  assert.strictEqual(invalidItem.isEmpty(), false);

  const validList = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    availableEquipment: [AVAILABLE_EQUIPMENT[0], AVAILABLE_EQUIPMENT[1]],
  });
  assert.strictEqual(validList.isEmpty(), true);

  const emptyList = await runValidation(validateCreateProfile, {
    ...getValidProfilePayload(),
    availableEquipment: [],
  });
  assert.strictEqual(emptyList.isEmpty(), true);
});
