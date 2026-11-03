import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import MenuItem from "@mui/material/MenuItem";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";
import { logWorkout } from "../../services/workoutService";
import { getExercises } from "../../services/exerciseService";
import { useToast } from "../../hooks/useToast";

const FEELINGS = ["Great", "Good", "Normal", "Tired", "Exhausted"];

function ActiveWorkoutTracker({
  initialRoutine,
  initialDay,
  onClose,
  onWorkoutLogged,
}) {
  const { showSuccess, showError } = useToast();

  const [routineName] = useState(
    initialDay && !initialDay.isRestDay
      ? initialRoutine?.name || "Active Routine"
      : "Freestyle Workout"
  );
  const [dayName] = useState(
    initialDay && !initialDay.isRestDay
      ? initialDay.name || "Workout Session"
      : "Daily Training Session"
  );
  const [exercises, setExercises] = useState(() => {
    if (initialDay && !initialDay.isRestDay && initialDay.exercises?.length > 0) {
      return initialDay.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets: Array.from({ length: ex.targetSets || 3 }, (_, i) => ({
          setNumber: i + 1,
          weight: 40,
          reps: ex.targetRepsMin || 10,
          completed: false,
        })),
        notes: ex.notes || "",
      }));
    }
    return [
      {
        exerciseName: "Barbell Bench Press",
        sets: [
          { setNumber: 1, weight: 60, reps: 10, completed: false },
          { setNumber: 2, weight: 60, reps: 10, completed: false },
          { setNumber: 3, weight: 60, reps: 8, completed: false },
        ],
      },
    ];
  });
  const [feeling, setFeeling] = useState("Good");
  const [notes, setNotes] = useState("");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Rest Timer state
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const [restActive, setRestActive] = useState(false);

  // Available exercises library for picker
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [selectedNewExercise, setSelectedNewExercise] = useState("");

  const restTimerRef = useRef(null);

  // Session elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rest countdown timer
  useEffect(() => {
    if (restActive && restSecondsRemaining > 0) {
      restTimerRef.current = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            setRestActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }

    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [restActive, restSecondsRemaining]);

  // Fetch exercise options for picker
  useEffect(() => {
    let mounted = true;
    getExercises()
      .then((res) => {
        if (mounted) setExerciseOptions(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch exercises:", err));
    return () => {
      mounted = false;
    };
  }, []);

  const startRestTimer = (seconds = 90) => {
    setRestSecondsRemaining(seconds);
    setRestActive(true);
  };

  const toggleSetComplete = (exIdx, setIdx) => {
    const updated = [...exercises];
    const targetSet = updated[exIdx].sets[setIdx];
    const newCompleted = !targetSet.completed;
    targetSet.completed = newCompleted;
    setExercises(updated);

    if (newCompleted) {
      startRestTimer(90);
    }
  };

  const handleSetChange = (exIdx, setIdx, field, val) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx][field] = Number(val);
    setExercises(updated);
  };

  const handleAddSet = (exIdx) => {
    const updated = [...exercises];
    const currentSets = updated[exIdx].sets;
    const lastSet = currentSets[currentSets.length - 1];
    updated[exIdx].sets.push({
      setNumber: currentSets.length + 1,
      weight: lastSet?.weight || 40,
      reps: lastSet?.reps || 10,
      completed: false,
    });
    setExercises(updated);
  };

  const handleRemoveSet = (exIdx, setIdx) => {
    const updated = [...exercises];
    if (updated[exIdx].sets.length <= 1) return;
    updated[exIdx].sets = updated[exIdx].sets
      .filter((_, i) => i !== setIdx)
      .map((s, i) => ({ ...s, setNumber: i + 1 }));
    setExercises(updated);
  };

  const handleAddExercise = () => {
    if (!selectedNewExercise) return;
    setExercises([
      ...exercises,
      {
        exerciseName: selectedNewExercise,
        sets: [
          { setNumber: 1, weight: 40, reps: 10, completed: false },
          { setNumber: 2, weight: 40, reps: 10, completed: false },
          { setNumber: 3, weight: 40, reps: 10, completed: false },
        ],
      },
    ]);
    setSelectedNewExercise("");
  };

  const handleRemoveExercise = (exIdx) => {
    if (exercises.length <= 1) return;
    setExercises(exercises.filter((_, i) => i !== exIdx));
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? "0" : ""}${remSecs}`;
  };

  const handleFinishWorkout = async () => {
    if (exercises.length === 0) {
      showError("Please log at least one exercise");
      return;
    }

    try {
      setSubmitting(true);
      const durationMinutes = Math.max(1, Math.round(secondsElapsed / 60));
      const payload = {
        routineName: routineName || "Workout Session",
        dayName: dayName || "Daily Training",
        durationMinutes,
        feeling,
        notes,
        exercises,
      };

      const res = await logWorkout(payload);
      showSuccess(`Workout completed! Logged ${durationMinutes} minutes with ${res.data.workout.totalVolumeKg} kg volume.`);
      onClose();
      onWorkoutLogged?.(res.data.workout);
    } catch (err) {
      console.error("Failed to log workout:", err);
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to log workout";
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 1 }}>
      {/* Session Timer & Rest Controls Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          p: 2,
          borderRadius: 2.5,
          bgcolor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            icon={<TimerOutlinedIcon sx={{ fontSize: "16px !important" }} />}
            label={`Elapsed: ${formatTime(secondsElapsed)}`}
            sx={{
              fontWeight: 700,
              fontSize: "0.85rem",
              bgcolor: "rgba(76, 175, 80, 0.15)",
              color: "#81C784",
              border: "1px solid rgba(76, 175, 80, 0.4)",
            }}
          />

          {restSecondsRemaining > 0 && (
            <Chip
              label={`Rest: ${restSecondsRemaining}s`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: "0.82rem" }}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Quick Rest:
          </Typography>
          <AppButton variant="text" size="small" onClick={() => startRestTimer(60)}>
            60s
          </AppButton>
          <AppButton variant="text" size="small" onClick={() => startRestTimer(90)}>
            90s
          </AppButton>
          <AppButton variant="text" size="small" onClick={() => startRestTimer(120)}>
            120s
          </AppButton>
        </Stack>
      </Box>

      {/* Exercises list with interactive sets */}
      <Stack spacing={3}>
        {exercises.map((ex, exIdx) => (
          <Box
            key={exIdx}
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600} color="#FFFFFF">
                {ex.exerciseName}
              </Typography>

              <IconButton
                size="small"
                onClick={() => handleRemoveExercise(exIdx)}
                disabled={exercises.length <= 1}
                sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Set headers */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "50px 1fr 1fr 60px 40px",
                gap: 1.5,
                mb: 1,
                px: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                SET
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                WEIGHT (KG)
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                REPS
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600} align="center">
                DONE
              </Typography>
              <Box />
            </Box>

            {/* Set rows */}
            <Stack spacing={1}>
              {ex.sets.map((set, setIdx) => (
                <Box
                  key={setIdx}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "50px 1fr 1fr 60px 40px",
                    gap: 1.5,
                    alignItems: "center",
                    p: 1,
                    borderRadius: 2,
                    bgcolor: set.completed
                      ? "rgba(76, 175, 80, 0.08)"
                      : "rgba(255, 255, 255, 0.03)",
                    border: set.completed
                      ? "1px solid rgba(76, 175, 80, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.05)",
                    transition: "all 0.15s ease-in-out",
                  }}
                >
                  <Typography variant="body2" fontWeight={700} color={set.completed ? "primary.main" : "text.secondary"} align="center">
                    {set.setNumber}
                  </Typography>

                  <TextField
                    size="small"
                    type="number"
                    value={set.weight}
                    onChange={(e) => handleSetChange(exIdx, setIdx, "weight", e.target.value)}
                    slotProps={{ htmlInput: { min: 0, max: 1000 } }}
                  />

                  <TextField
                    size="small"
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleSetChange(exIdx, setIdx, "reps", e.target.value)}
                    slotProps={{ htmlInput: { min: 0, max: 200 } }}
                  />

                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <IconButton
                      size="small"
                      onClick={() => toggleSetComplete(exIdx, setIdx)}
                      color={set.completed ? "primary" : "default"}
                    >
                      {set.completed ? (
                        <CheckCircleRoundedIcon fontSize="small" />
                      ) : (
                        <RadioButtonUncheckedRoundedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => handleRemoveSet(exIdx, setIdx)}
                    disabled={ex.sets.length <= 1}
                    sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 1.5 }}>
              <AppButton
                variant="text"
                size="small"
                startIcon={<AddCircleOutlineRoundedIcon />}
                onClick={() => handleAddSet(exIdx)}
              >
                + Add Set
              </AppButton>
            </Box>
          </Box>
        ))}

        {/* Add Exercise Bar */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: "rgba(255, 255, 255, 0.02)",
            border: "1px dashed rgba(255, 255, 255, 0.1)",
            display: "flex",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <TextField
            select
            fullWidth
            size="small"
            label="Select Exercise to Add"
            value={selectedNewExercise}
            onChange={(e) => setSelectedNewExercise(e.target.value)}
          >
            {exerciseOptions.map((opt) => (
              <MenuItem key={opt._id} value={opt.name}>
                {opt.name} ({opt.primaryMuscle})
              </MenuItem>
            ))}
          </TextField>

          <AppButton
            variant="outlined"
            size="medium"
            onClick={handleAddExercise}
            disabled={!selectedNewExercise}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add Exercise
          </AppButton>
        </Box>

        {/* Feeling & Session Notes */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="How did it feel?"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            >
              {FEELINGS.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              fullWidth
              size="small"
              label="Workout Notes (Optional)"
              placeholder="Good pump, increased bench weight by 2.5kg..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
        </Grid>
      </Stack>

      {/* Modal Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          mt: 4,
          pt: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <AppButton variant="outlined" onClick={onClose} disabled={submitting}>
          Cancel
        </AppButton>
        <AppButton onClick={handleFinishWorkout} loading={submitting}>
          Finish Workout
        </AppButton>
      </Box>
    </Box>
  );
}

function ActiveWorkoutModal({
  open,
  initialRoutine,
  initialDay,
  onClose,
  onWorkoutLogged,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={initialDay?.name || "Active Workout"}
      subtitle={initialRoutine?.name || "Live Training Tracker"}
      maxWidth="md"
    >
      {open && (
        <ActiveWorkoutTracker
          key={`${initialRoutine?._id || "custom"}-${initialDay?.dayNumber || "0"}`}
          initialRoutine={initialRoutine}
          initialDay={initialDay}
          onClose={onClose}
          onWorkoutLogged={onWorkoutLogged}
        />
      )}
    </AppModal>
  );
}

export default ActiveWorkoutModal;
