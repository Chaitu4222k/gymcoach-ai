import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";
import { getWorkoutHistory, deleteWorkout } from "../../services/workoutService";
import { useToast } from "../../hooks/useToast";

function StatItem({ icon, label, value }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2.5,
        bgcolor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          p: 1.25,
          borderRadius: 2,
          bgcolor: "rgba(255, 255, 255, 0.05)",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={700} color="#FFFFFF">
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function WorkoutSessionCard({ session, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = new Date(session.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        bgcolor: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.04)",
          borderColor: "rgba(255, 255, 255, 0.12)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {formattedDate} • {session.routineName}
          </Typography>
          <Typography variant="h6" fontWeight={600} color="#FFFFFF">
            {session.dayName}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`${session.durationMinutes} mins`}
            size="small"
            sx={{ bgcolor: "rgba(255, 255, 255, 0.05)", fontSize: "0.75rem" }}
          />

          <Chip
            label={`${session.totalVolumeKg?.toLocaleString() || 0} kg volume`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
          />

          <Chip
            label={session.feeling}
            size="small"
            sx={{
              bgcolor: "rgba(33, 150, 243, 0.12)",
              color: "#64B5F6",
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          />

          <IconButton
            size="small"
            onClick={() => onDelete(session)}
            sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Exercises summary line */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {session.exercises?.map((e) => e.exerciseName).join(" • ")}
      </Typography>

      {/* Expand/Collapse Toggle */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <AppButton
          variant="text"
          size="small"
          endIcon={expanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
          onClick={() => setExpanded(!expanded)}
          sx={{ fontSize: "0.75rem", p: 0, minWidth: 0, color: "text.secondary" }}
        >
          {expanded ? "Hide set details" : `View ${session.exercises?.length || 0} exercises detail`}
        </AppButton>
      </Box>

      {/* Expandable sets details */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <Stack spacing={2}>
            {session.exercises?.map((ex, exIdx) => (
              <Box
                key={exIdx}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} color="#FFFFFF" gutterBottom>
                  {ex.exerciseName}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {ex.sets?.map((s, sIdx) => (
                    <Chip
                      key={sIdx}
                      label={`Set ${s.setNumber}: ${s.weight}kg × ${s.reps}`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.72rem",
                        bgcolor: s.completed !== false ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 255, 255, 0.05)",
                        color: s.completed !== false ? "#81C784" : "text.secondary",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

function WorkoutHistoryModal({ open, onClose }) {
  const { showSuccess, showError } = useToast();

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteSession, setDeleteSession] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;
    let ignore = false;

    getWorkoutHistory()
      .then((res) => {
        if (!ignore) {
          setLogs(res.data.logs || []);
          setStats(res.data.stats || null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load workout history:", err);
          showError("Failed to load workout history");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [open, showError]);

  const handleDeleteSession = async () => {
    if (!deleteSession) return;
    try {
      setDeleting(true);
      await deleteWorkout(deleteSession._id);
      showSuccess("Workout session deleted");
      setLogs((prev) => prev.filter((s) => s._id !== deleteSession._id));
      setDeleteSession(null);
    } catch (err) {
      console.error("Failed to delete session:", err);
      showError("Failed to delete workout session");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AppModal
        open={open}
        onClose={onClose}
        title="Workout History"
        subtitle="Review past training logs, volume trends, and session details."
        maxWidth="md"
        showFooter={true}
        footer={
          <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <AppButton variant="outlined" onClick={onClose}>
              Close
            </AppButton>
          </Box>
        }
      >
        <Box sx={{ py: 1 }}>
          {/* Top Aggregate Stats Bar */}
          {stats && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatItem
                  icon={<FitnessCenterRoundedIcon fontSize="small" />}
                  label="Total Workouts"
                  value={stats.totalWorkouts || 0}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatItem
                  icon={<CalendarMonthRoundedIcon fontSize="small" />}
                  label="This Week"
                  value={stats.workoutsThisWeek || 0}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatItem
                  icon={<WhatshotRoundedIcon fontSize="small" />}
                  label="Total Volume"
                  value={`${(stats.totalVolumeKg || 0).toLocaleString()} kg`}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatItem
                  icon={<AccessTimeRoundedIcon fontSize="small" />}
                  label="Total Time"
                  value={`${Math.round((stats.totalDurationMinutes || 0) / 60)} hrs`}
                />
              </Grid>
            </Grid>
          )}

          {/* Session History Feed */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
                gap: 2,
              }}
            >
              <CircularProgress size={36} />
              <Typography variant="body2" color="text.secondary">
                Loading workout history...
              </Typography>
            </Box>
          ) : logs.length === 0 ? (
            <Box
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "rgba(255, 255, 255, 0.02)",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
              }}
            >
              <FitnessCenterRoundedIcon sx={{ fontSize: 44, color: "text.secondary", mb: 1.5, opacity: 0.5 }} />
              <Typography variant="h6" fontWeight={600} color="#FFFFFF" gutterBottom>
                No Workouts Logged Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
                Complete your first workout session using the active tracker to see your session history and performance stats.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {logs.map((session) => (
                <WorkoutSessionCard
                  key={session._id}
                  session={session}
                  onDelete={setDeleteSession}
                />
              ))}
            </Stack>
          )}
        </Box>
      </AppModal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteSession)}
        onClose={() => !deleting && setDeleteSession(null)}
        disableRestoreFocus
      >
        <DialogTitle>Delete Workout Session</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this workout session log?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <AppButton
            variant="outlined"
            onClick={() => setDeleteSession(null)}
            disabled={deleting}
          >
            Cancel
          </AppButton>
          <AppButton
            color="error"
            variant="contained"
            loading={deleting}
            onClick={handleDeleteSession}
          >
            Delete Session
          </AppButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WorkoutHistoryModal;
