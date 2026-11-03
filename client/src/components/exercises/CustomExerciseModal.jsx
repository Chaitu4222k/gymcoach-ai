import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";
import { createCustomExercise } from "../../services/exerciseService";
import { useToast } from "../../hooks/useToast";

function CustomExerciseModal({ open, onClose, options, onSuccess }) {
  const { showSuccess, showError } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [instructionSteps, setInstructionSteps] = useState([]);
  const [currentStepText, setCurrentStepText] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      category: "Strength",
      primaryMuscle: "Chest",
      secondaryMuscles: [],
      equipment: "Dumbbells",
      difficulty: "Beginner",
    },
  });

  const handleAddStep = () => {
    if (!currentStepText.trim()) return;
    setInstructionSteps([...instructionSteps, currentStepText.trim()]);
    setCurrentStepText("");
  };

  const handleRemoveStep = (index) => {
    setInstructionSteps(instructionSteps.filter((_, i) => i !== index));
  };

  const handleModalClose = () => {
    reset();
    setInstructionSteps([]);
    setCurrentStepText("");
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const payload = {
        ...data,
        instructions: instructionSteps,
      };
      const res = await createCustomExercise(payload);
      showSuccess("Custom exercise created successfully");
      handleModalClose();
      onSuccess?.(res.data.exercise);
    } catch (err) {
      console.error("Failed to create custom exercise:", err);
      const message =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to create exercise";
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={handleModalClose}
      title="Create Custom Exercise"
      subtitle="Add your custom movement to the library"
      maxWidth="md"
      showFooter={true}
      footer={
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, width: "100%" }}>
          <AppButton
            variant="outlined"
            onClick={handleModalClose}
            disabled={submitting}
          >
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            form="custom-exercise-form"
            loading={submitting}
          >
            Create Exercise
          </AppButton>
        </Box>
      }
    >
      <Box
        component="form"
        id="custom-exercise-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ py: 1 }}
      >
        <Grid container spacing={2.5}>
          {/* Exercise Name */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Exercise Name"
              placeholder="e.g. Incline Cable Crossover"
              {...register("name", {
                required: "Exercise name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Name cannot exceed 100 characters",
                },
              })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Grid>

          {/* Category */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Category"
                  error={Boolean(errors.category)}
                  helperText={errors.category?.message}
                >
                  {options?.categories?.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Primary Muscle */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="primaryMuscle"
              control={control}
              rules={{ required: "Primary muscle is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Primary Muscle Group"
                  error={Boolean(errors.primaryMuscle)}
                  helperText={errors.primaryMuscle?.message}
                >
                  {options?.muscleGroups?.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Equipment */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="equipment"
              control={control}
              rules={{ required: "Equipment is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Equipment"
                  error={Boolean(errors.equipment)}
                  helperText={errors.equipment?.message}
                >
                  {options?.equipment?.map((eq) => (
                    <MenuItem key={eq} value={eq}>
                      {eq}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Difficulty */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Difficulty Level"
                >
                  {options?.difficultyLevels?.map((diff) => (
                    <MenuItem key={diff} value={diff}>
                      {diff}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Secondary Muscles (Multi-select) */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="secondaryMuscles"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="secondary-muscles-label">
                    Secondary Muscles (Optional)
                  </InputLabel>
                  <Select
                    labelId="secondary-muscles-label"
                    multiple
                    value={field.value || []}
                    onChange={(e) => field.onChange(e.target.value)}
                    input={<OutlinedInput label="Secondary Muscles (Optional)" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((val) => (
                          <Chip key={val} label={val} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {options?.muscleGroups?.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          {/* Instruction Steps */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Instruction Steps (Optional)
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter a step description..."
                value={currentStepText}
                onChange={(e) => setCurrentStepText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
              />
              <AppButton
                type="button"
                variant="outlined"
                onClick={handleAddStep}
                startIcon={<AddCircleOutlineRoundedIcon />}
                sx={{ whiteSpace: "nowrap" }}
              >
                Add Step
              </AppButton>
            </Box>

            {instructionSteps.length > 0 && (
              <Stack spacing={1}>
                {instructionSteps.map((step, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.25,
                      borderRadius: 2,
                      bgcolor: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          minWidth: 20,
                        }}
                      >
                        {idx + 1}.
                      </Typography>
                      <Typography variant="body2" color="#E0E0E0">
                        {step}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() => handleRemoveStep(idx)}
                      sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>
    </AppModal>
  );
}

export default CustomExerciseModal;
