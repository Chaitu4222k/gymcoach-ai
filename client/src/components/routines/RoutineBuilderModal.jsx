import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";
import { createRoutine, updateRoutine } from "../../services/routineService";
import { getExercises } from "../../services/exerciseService";
import { useToast } from "../../hooks/useToast";

const GOALS = [
  "Build Muscle",
  "Lose Fat",
  "Maintain Weight",
  "Improve Endurance",
  "Increase Strength",
  "General Fitness",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

function RoutineBuilderForm({
  routineToEdit,
  availableExercises,
  onClose,
  onSuccess,
}) {
  const { showSuccess, showError } = useToast();

  const [name, setName] = useState(routineToEdit?.name || "");
  const [description, setDescription] = useState(routineToEdit?.description || "");
  const [goal, setGoal] = useState(routineToEdit?.goal || "Build Muscle");
  const [difficulty, setDifficulty] = useState(routineToEdit?.difficulty || "Intermediate");
  const [days, setDays] = useState(
    routineToEdit?.days || [
      {
        dayNumber: 1,
        name: "Day 1: Full Body",
        isRestDay: false,
        targetMuscleGroups: ["Chest", "Back", "Quadriceps"],
        exercises: [],
      },
      {
        dayNumber: 2,
        name: "Day 2: Rest & Recovery",
        isRestDay: true,
        targetMuscleGroups: [],
        exercises: [],
      },
      {
        dayNumber: 3,
        name: "Day 3: Full Body",
        isRestDay: false,
        targetMuscleGroups: ["Hamstrings", "Shoulders", "Core / Abs"],
        exercises: [],
      },
    ]
  );
  const [activeTab, setActiveTab] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleAddDay = () => {
    if (days.length >= 7) return;
    const nextDayNum = days.length + 1;
    setDays([
      ...days,
      {
        dayNumber: nextDayNum,
        name: `Day ${nextDayNum}: Workout`,
        isRestDay: false,
        targetMuscleGroups: [],
        exercises: [],
      },
    ]);
    setActiveTab(days.length);
  };

  const handleRemoveDay = (index) => {
    if (days.length <= 1) return;
    const updated = days
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, dayNumber: i + 1 }));
    setDays(updated);
    setActiveTab(Math.max(0, activeTab - 1));
  };

  const handleDayFieldChange = (field, value) => {
    const updated = [...days];
    updated[activeTab] = {
      ...updated[activeTab],
      [field]: value,
    };
    setDays(updated);
  };

  const handleAddExerciseToCurrentDay = (exerciseName = "Barbell Bench Press") => {
    const updated = [...days];
    const currentExercises = updated[activeTab].exercises || [];
    updated[activeTab].exercises = [
      ...currentExercises,
      {
        exerciseName,
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 90,
        notes: "",
      },
    ];
    setDays(updated);
  };

  const handleRemoveExerciseFromCurrentDay = (exIndex) => {
    const updated = [...days];
    updated[activeTab].exercises = updated[activeTab].exercises.filter(
      (_, i) => i !== exIndex
    );
    setDays(updated);
  };

  const handleExerciseFieldChange = (exIndex, field, value) => {
    const updated = [...days];
    const targetEx = { ...updated[activeTab].exercises[exIndex], [field]: value };
    updated[activeTab].exercises[exIndex] = targetEx;
    setDays(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Routine name is required");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        description: description.trim(),
        goal,
        difficulty,
        daysPerWeek: days.length,
        days,
      };

      let res;
      if (routineToEdit?._id) {
        res = await updateRoutine(routineToEdit._id, payload);
        showSuccess("Routine updated successfully");
      } else {
        res = await createRoutine(payload);
        showSuccess("Routine created successfully");
      }

      onClose();
      onSuccess?.(res.data.routine);
    } catch (err) {
      console.error("Failed to save routine:", err);
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to save routine";
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const currentDay = days[activeTab];

  return (
    <Box sx={{ py: 1 }}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            fullWidth
            label="Routine Name"
            placeholder="e.g. 4-Day Upper / Lower Hypertrophy Split"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            fullWidth
            label="Fitness Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            {GOALS.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            fullWidth
            label="Difficulty Level"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {DIFFICULTIES.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Program Days / Week"
            value={`${days.length} days configured`}
            disabled
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description (Optional)"
            placeholder="Add key notes, split cadence, or focus areas..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Days & Split Builder Section */}
      <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#FFFFFF">
            Split Days ({days.length}/7)
          </Typography>

          <AppButton
            variant="outlined"
            size="small"
            startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={handleAddDay}
            disabled={days.length >= 7}
          >
            Add Day
          </AppButton>
        </Box>

        {/* Days Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            mb: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              px: 2,
            },
          }}
        >
          {days.map((day, idx) => (
            <Tab
              key={idx}
              label={day.isRestDay ? `Day ${day.dayNumber} (Rest)` : `Day ${day.dayNumber}`}
            />
          ))}
        </Tabs>

        {/* Active Day Configuration */}
        {currentDay && (
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Day Name"
                  value={currentDay.name}
                  onChange={(e) => handleDayFieldChange("name", e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(currentDay.isRestDay)}
                      onChange={(e) => handleDayFieldChange("isRestDay", e.target.checked)}
                    />
                  }
                  label="Rest Day"
                />
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }} sx={{ textAlign: "right" }}>
                <AppButton
                  color="error"
                  variant="text"
                  size="small"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={() => handleRemoveDay(activeTab)}
                  disabled={days.length <= 1}
                >
                  Delete Day
                </AppButton>
              </Grid>
            </Grid>

            {/* If not rest day, show exercise configuration */}
            {!currentDay.isRestDay && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    pt: 2,
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Scheduled Exercises ({currentDay.exercises?.length || 0})
                  </Typography>

                  <AppButton
                    variant="text"
                    size="small"
                    startIcon={<AddCircleOutlineRoundedIcon />}
                    onClick={() => handleAddExerciseToCurrentDay()}
                  >
                    + Add Exercise
                  </AppButton>
                </Box>

                {currentDay.exercises && currentDay.exercises.length > 0 ? (
                  <Stack spacing={2}>
                    {currentDay.exercises.map((ex, exIdx) => (
                      <Box
                        key={exIdx}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <Grid container spacing={1.5} alignItems="center">
                          {/* Exercise selector / name */}
                          <Grid size={{ xs: 12, sm: 5 }}>
                            {availableExercises.length > 0 ? (
                              <TextField
                                select
                                fullWidth
                                size="small"
                                label="Exercise"
                                value={ex.exerciseName}
                                onChange={(e) =>
                                  handleExerciseFieldChange(
                                    exIdx,
                                    "exerciseName",
                                    e.target.value
                                  )
                                }
                              >
                                {availableExercises.map((ae) => (
                                  <MenuItem key={ae._id} value={ae.name}>
                                    {ae.name} ({ae.primaryMuscle})
                                  </MenuItem>
                                ))}
                              </TextField>
                            ) : (
                              <TextField
                                fullWidth
                                size="small"
                                label="Exercise Name"
                                value={ex.exerciseName}
                                onChange={(e) =>
                                  handleExerciseFieldChange(
                                    exIdx,
                                    "exerciseName",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </Grid>

                          {/* Sets */}
                          <Grid size={{ xs: 3, sm: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              label="Sets"
                              value={ex.targetSets}
                              onChange={(e) =>
                                handleExerciseFieldChange(
                                  exIdx,
                                  "targetSets",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </Grid>

                          {/* Reps Min */}
                          <Grid size={{ xs: 3, sm: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              label="Reps Min"
                              value={ex.targetRepsMin}
                              onChange={(e) =>
                                handleExerciseFieldChange(
                                  exIdx,
                                  "targetRepsMin",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </Grid>

                          {/* Reps Max */}
                          <Grid size={{ xs: 3, sm: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              label="Reps Max"
                              value={ex.targetRepsMax}
                              onChange={(e) =>
                                handleExerciseFieldChange(
                                  exIdx,
                                  "targetRepsMax",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </Grid>

                          {/* Delete */}
                          <Grid size={{ xs: 3, sm: 1 }} sx={{ textAlign: "right" }}>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveExerciseFromCurrentDay(exIdx)}
                              sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", textAlign: "center", py: 2 }}
                  >
                    No exercises added to this day yet. Click "+ Add Exercise" above.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Modal Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          mt: 3,
          pt: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <AppButton variant="outlined" onClick={onClose} disabled={submitting}>
          Cancel
        </AppButton>
        <AppButton onClick={handleSubmit} loading={submitting}>
          {routineToEdit ? "Save Changes" : "Create Routine"}
        </AppButton>
      </Box>
    </Box>
  );
}

function RoutineBuilderModal({ open, routineToEdit, onClose, onSuccess }) {
  const [availableExercises, setAvailableExercises] = useState([]);

  // Fetch exercise options for picker
  useEffect(() => {
    if (!open) return;
    let mounted = true;
    getExercises()
      .then((res) => {
        if (mounted) setAvailableExercises(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch exercises:", err);
      });
    return () => {
      mounted = false;
    };
  }, [open]);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={routineToEdit ? "Edit Workout Routine" : "Create Workout Routine"}
      subtitle="Design your personalized split, scheduled days, and target sets/reps"
      maxWidth="md"
    >
      {open && (
        <RoutineBuilderForm
          key={routineToEdit?._id || "new-routine"}
          routineToEdit={routineToEdit}
          availableExercises={availableExercises}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </AppModal>
  );
}

export default RoutineBuilderModal;
