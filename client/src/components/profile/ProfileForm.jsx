import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import AppButton from "../buttons/AppButton";
import AppTextField from "../inputs/AppTextField";

import {
  FITNESS_GOALS,
  WORKOUT_LOCATIONS,
  DIET_PREFERENCES,
  ACTIVITY_LEVELS,
  AVAILABLE_EQUIPMENT,
} from "../../constants/profileConstants";

const NUMBER_BLOCKED_KEYS = ["-", "+", "e", "E"];

const preventNegativeInput = (event) => {
  if (NUMBER_BLOCKED_KEYS.includes(event.key)) {
    event.preventDefault();
  }
};

function ProfileForm({
  control,
  register,
  errors,
  loading,
  isProfileCreated,
  showEquipment,
}) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <AppTextField
            label="Height (cm)"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            onKeyDown={preventNegativeInput}
            {...register("height", {
              required: "Height is required",
              min: {
                value: 100,
                message: "Minimum 100 cm",
              },
              max: {
                value: 250,
                message: "Maximum 250 cm",
              },
              valueAsNumber: true,
            })}
            error={!!errors.height}
            helperText={errors.height?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label="Weight (kg)"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            onKeyDown={preventNegativeInput}
            {...register("weight", {
              required: "Weight is required",
              min: {
                value: 25,
                message: "Minimum 25 kg",
              },
              max: {
                value: 350,
                message: "Maximum 350 kg",
              },
              valueAsNumber: true,
            })}
            error={!!errors.weight}
            helperText={errors.weight?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="fitnessGoal"
            control={control}
            rules={{ required: "Fitness goal is required" }}
            render={({ field }) => (
              <AppTextField
                select
                label="Fitness Goal"
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors.fitnessGoal}
                helperText={errors.fitnessGoal?.message}
              >
                {FITNESS_GOALS.map((goal) => (
                  <MenuItem key={goal} value={goal}>
                    {goal}
                  </MenuItem>
                ))}
              </AppTextField>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label="Experience (Months)"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            onKeyDown={preventNegativeInput}
            {...register("experienceMonths", {
              required: "Experience is required",
              min: {
                value: 0,
                message: "Minimum 0 months",
              },
              max: {
                value: 600,
                message: "Maximum 600 months",
              },
              valueAsNumber: true,
            })}
            error={!!errors.experienceMonths}
            helperText={errors.experienceMonths?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="workoutLocation"
            control={control}
            rules={{ required: "Workout location is required" }}
            render={({ field }) => (
              <AppTextField
                select
                label="Workout Location"
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors.workoutLocation}
                helperText={errors.workoutLocation?.message}
              >
                {WORKOUT_LOCATIONS.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </AppTextField>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label="Workout Days / Week"
            type="number"
            inputProps={{ min: 1, max: 7, step: 1 }}
            onKeyDown={preventNegativeInput}
            {...register("workoutDaysPerWeek", {
              required: "Workout days per week is required",
              min: {
                value: 1,
                message: "Minimum 1 day",
              },
              max: {
                value: 7,
                message: "Maximum 7 days",
              },
              valueAsNumber: true,
            })}
            error={!!errors.workoutDaysPerWeek}
            helperText={errors.workoutDaysPerWeek?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label="Workout Duration (Minutes)"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            onKeyDown={preventNegativeInput}
            {...register("workoutDuration", {
              required: "Workout duration is required",
              min: {
                value: 15,
                message: "Minimum 15 minutes",
              },
              max: {
                value: 180,
                message: "Maximum 180 minutes",
              },
              valueAsNumber: true,
            })}
            error={!!errors.workoutDuration}
            helperText={errors.workoutDuration?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="dietPreference"
            control={control}
            rules={{ required: "Diet preference is required" }}
            render={({ field }) => (
              <AppTextField
                select
                label="Diet Preference"
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors.dietPreference}
                helperText={errors.dietPreference?.message}
              >
                {DIET_PREFERENCES.map((diet) => (
                  <MenuItem key={diet} value={diet}>
                    {diet}
                  </MenuItem>
                ))}
              </AppTextField>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppTextField
            label="Average Sleep Hours"
            type="number"
            inputProps={{ min: 0, step: 0.5 }}
            onKeyDown={preventNegativeInput}
            {...register("averageSleepHours", {
              required: "Average sleep hours is required",
              min: {
                value: 1,
                message: "Minimum 1 hour",
              },
              max: {
                value: 16,
                message: "Maximum 16 hours",
              },
              valueAsNumber: true,
            })}
            error={!!errors.averageSleepHours}
            helperText={errors.averageSleepHours?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="activityLevel"
            control={control}
            rules={{ required: "Activity level is required" }}
            render={({ field }) => (
              <AppTextField
                select
                label="Activity Level"
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors.activityLevel}
                helperText={errors.activityLevel?.message}
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </AppTextField>
            )}
          />
        </Grid>

        {showEquipment && (
          <Grid item xs={12}>
            <Controller
              name="availableEquipment"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={AVAILABLE_EQUIPMENT}
                  value={field.value || []}
                  onChange={(_, value) => field.onChange(value)}
                  disableCloseOnSelect
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Available Equipment"
                      margin="normal"
                      error={!!errors.availableEquipment}
                      helperText={errors.availableEquipment?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
        )}
      </Grid>

      <AppButton type="submit" loading={loading}>
        {isProfileCreated ? "Update Profile" : "Create Profile"}
      </AppButton>
    </>
  );
}

export default ProfileForm;