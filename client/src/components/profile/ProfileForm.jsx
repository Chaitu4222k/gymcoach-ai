import { Controller } from "react-hook-form";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

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

function FieldLabel({ label }) {
  return (
    <Typography variant="body2" fontWeight={600} mb={0.75}>
      {label}
    </Typography>
  );
}

function ProfileForm({
  control,
  register,
  errors,
  showEquipment,
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
        },
        columnGap: 3,
        rowGap: 3,
        width: "100%",
      }}
    >
      <Box>
        <FieldLabel label="Height (cm)" />
        <TextField
          fullWidth
          placeholder="Enter height"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
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
          })}
          error={!!errors.height}
          helperText={errors.height?.message}
        />
      </Box>

      <Box>
        <FieldLabel label="Weight (kg)" />
        <TextField
          fullWidth
          placeholder="Enter weight"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
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
          })}
          error={!!errors.weight}
          helperText={errors.weight?.message}
        />
      </Box>

      <Box>
        <FieldLabel label="Fitness Goal" />
        <Controller
          name="fitnessGoal"
          control={control}
          rules={{ required: "Fitness goal is required" }}
          render={({ field }) => (
            <TextField
              select
              fullWidth
              value={field.value || ""}
              onChange={field.onChange}
              error={!!errors.fitnessGoal}
              helperText={errors.fitnessGoal?.message}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          Select fitness goal
                        </span>
                      );
                    }
                    return selected;
                  },
                },
              }}
            >
              <MenuItem disabled value="">
                    Select fitness goal
              </MenuItem>
              {FITNESS_GOALS.map((goal) => (
                <MenuItem key={goal} value={goal}>
                  {goal}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>

      <Box>
        <FieldLabel label="Experience (Months)" />
        <TextField
          fullWidth
          placeholder="Enter experience"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
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
          })}
          error={!!errors.experienceMonths}
          helperText={errors.experienceMonths?.message}
        />
      </Box>

      <Box>
        <FieldLabel label="Workout Location" />
        <Controller
          name="workoutLocation"
          control={control}
          rules={{ required: "Workout location is required" }}
          render={({ field }) => (
            <TextField
              select
              fullWidth
              value={field.value || ""}
              onChange={field.onChange}
              error={!!errors.workoutLocation}
              helperText={errors.workoutLocation?.message}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          Select workout location
                        </span>
                      );
                    }
                    return selected;
                  },
                },
              }}
            >
              <MenuItem disabled value="">
                Select workout location
              </MenuItem>
              {WORKOUT_LOCATIONS.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>

      <Box>
        <FieldLabel label="Workout Days / Week" />
        <TextField
          fullWidth
          placeholder="Enter workout days"
          type="number"
          slotProps={{ htmlInput: { min: 1, max: 7, step: 1 } }}
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
          })}
          error={!!errors.workoutDaysPerWeek}
          helperText={errors.workoutDaysPerWeek?.message}
        />
      </Box>

      <Box>
        <FieldLabel label="Workout Duration (Minutes)" />
        <TextField
          fullWidth
          placeholder="Enter workout duration"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
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
          })}
          error={!!errors.workoutDuration}
          helperText={errors.workoutDuration?.message}
        />
      </Box>

      <Box>
        <FieldLabel label="Diet Preference" />
        <Controller
          name="dietPreference"
          control={control}
          rules={{ required: "Diet preference is required" }}
          render={({ field }) => (
            <TextField
              select
              fullWidth
              value={field.value || ""}
              onChange={field.onChange}
              error={!!errors.dietPreference}
              helperText={errors.dietPreference?.message}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          Select diet preference
                        </span>
                      );
                    }
                    return selected;
                  },
                },
              }}
            >
              <MenuItem disabled value="">
                Select diet preference
              </MenuItem>
              {DIET_PREFERENCES.map((diet) => (
                <MenuItem key={diet} value={diet}>
                  {diet}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>

      <Box>
        <FieldLabel label="Average Sleep Hours" />
        <TextField
          fullWidth
          placeholder="Enter average sleep"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: 0.5 } }}
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
          })}
          error={!!errors.averageSleepHours}
          helperText={errors.averageSleepHours?.message}
        />
      </Box>

      <Box>
        <FieldLabel label="Activity Level" />
        <Controller
          name="activityLevel"
          control={control}
          rules={{ required: "Activity level is required" }}
          render={({ field }) => (
            <TextField
              select
              fullWidth
              value={field.value || ""}
              onChange={field.onChange}
              error={!!errors.activityLevel}
              helperText={errors.activityLevel?.message}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          Select activity level
                        </span>
                      );
                    }
                    return selected;
                  },
                },
              }}
            >
              <MenuItem disabled value="">
                Select activity level
              </MenuItem>
              {ACTIVITY_LEVELS.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>

      {showEquipment && (
        <Box
          sx={{
            gridColumn: {
              xs: "auto",
              md: "1 / -1",
            },
          }}
        >
          <FieldLabel label="Available Equipment" />
          <Controller
            name="availableEquipment"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={AVAILABLE_EQUIPMENT}
                disableCloseOnSelect
                filterSelectedOptions
                value={Array.isArray(field.value) ? field.value : []}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder={
                      field.value?.length
                          ? ""
                          : "Select available equipment"
                    }
                    error={!!errors.availableEquipment}
                    helperText={errors.availableEquipment?.message}
                  />
                )}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
}

export default ProfileForm;