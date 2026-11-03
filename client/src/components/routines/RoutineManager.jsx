import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";
import RoutineCard from "./RoutineCard";
import RoutineDaySchedule from "./RoutineDaySchedule";
import RoutineBuilderModal from "./RoutineBuilderModal";
import StarterRecommendationModal from "./StarterRecommendationModal";
import {
  getUserRoutines,
  setActiveRoutine,
  deleteRoutine,
} from "../../services/routineService";
import { useToast } from "../../hooks/useToast";

function RoutineManager({ open, onClose }) {
  const { showSuccess, showError } = useToast();

  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal sub-states
  const [viewScheduleRoutine, setViewScheduleRoutine] = useState(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [starterOpen, setStarterOpen] = useState(false);
  const [deleteConfirmRoutine, setDeleteConfirmRoutine] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;
    let ignore = false;

    getUserRoutines()
      .then((res) => {
        if (!ignore) {
          setRoutines(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load routines:", err);
          showError("Failed to load routines");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [open, showError]);

  const handleSetActive = async (routine) => {
    try {
      await setActiveRoutine(routine._id);
      showSuccess(`"${routine.name}" set as your active routine`);
      setRoutines((prev) =>
        prev.map((r) => ({
          ...r,
          isActive: r._id === routine._id,
        }))
      );
    } catch (err) {
      console.error("Failed to set active routine:", err);
      showError("Failed to update active routine");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmRoutine) return;
    try {
      setDeleting(true);
      await deleteRoutine(deleteConfirmRoutine._id);
      showSuccess("Workout routine deleted successfully");
      setRoutines((prev) => prev.filter((r) => r._id !== deleteConfirmRoutine._id));
      setDeleteConfirmRoutine(null);
    } catch (err) {
      console.error("Failed to delete routine:", err);
      showError(err.response?.data?.message || "Failed to delete routine");
    } finally {
      setDeleting(false);
    }
  };

  const handleRoutineSaved = (savedRoutine) => {
    setRoutines((prev) => {
      const exists = prev.some((r) => r._id === savedRoutine._id);
      if (exists) {
        return prev.map((r) => (r._id === savedRoutine._id ? savedRoutine : r));
      }
      return [savedRoutine, ...prev];
    });
  };

  return (
    <>
      <AppModal
        open={open}
        onClose={onClose}
        title="Workout Planner"
        subtitle="Manage your training splits, scheduled workout days, and active routines."
        maxWidth="lg"
        disableEnforceFocus={Boolean(
          viewScheduleRoutine || builderOpen || starterOpen || deleteConfirmRoutine
        )}
        headerActions={
          <Stack direction="row" spacing={1}>
            <AppButton
              variant="outlined"
              size="small"
              startIcon={<AutoAwesomeRoundedIcon />}
              onClick={() => setStarterOpen(true)}
              sx={{ fontWeight: 600 }}
            >
              Recommended Plan
            </AppButton>
            <AppButton
              variant="contained"
              size="small"
              startIcon={<AddRoundedIcon />}
              onClick={() => {
                setEditingRoutine(null);
                setBuilderOpen(true);
              }}
              sx={{ fontWeight: 600 }}
            >
              New Routine
            </AppButton>
          </Stack>
        }
      >
        <Box sx={{ py: 1 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 10,
                gap: 2,
              }}
            >
              <CircularProgress size={36} />
              <Typography variant="body2" color="text.secondary">
                Loading routines...
              </Typography>
            </Box>
          ) : routines.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
                px: 2,
                borderRadius: 3,
                bgcolor: "rgba(255, 255, 255, 0.02)",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
            >
              <FitnessCenterRoundedIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 1.5, opacity: 0.6 }}
              />
              <Typography variant="h6" fontWeight={600} color="#FFFFFF" gutterBottom>
                No Workout Routines Yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 450, mb: 3 }}
              >
                Start by creating your custom training split or adopt a recommended starter program tailored to your fitness profile.
              </Typography>

              <Stack direction="row" spacing={1.5}>
                <AppButton
                  variant="outlined"
                  size="small"
                  startIcon={<AutoAwesomeRoundedIcon />}
                  onClick={() => setStarterOpen(true)}
                >
                  Adopt Recommended Plan
                </AppButton>
                <AppButton
                  variant="contained"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => {
                    setEditingRoutine(null);
                    setBuilderOpen(true);
                  }}
                >
                  Create Custom Routine
                </AppButton>
              </Stack>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {routines.map((routine) => (
                <Grid key={routine._id} size={{ xs: 12, md: 6 }}>
                  <RoutineCard
                    routine={routine}
                    onViewSchedule={setViewScheduleRoutine}
                    onEdit={(r) => {
                      setEditingRoutine(r);
                      setBuilderOpen(true);
                    }}
                    onSetActive={handleSetActive}
                    onDelete={setDeleteConfirmRoutine}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </AppModal>

      {/* View Split & Schedule Modal */}
      <RoutineDaySchedule
        open={Boolean(viewScheduleRoutine)}
        routine={viewScheduleRoutine}
        onClose={() => setViewScheduleRoutine(null)}
      />

      {/* Routine Builder / Editor Modal */}
      <RoutineBuilderModal
        open={builderOpen}
        routineToEdit={editingRoutine}
        onClose={() => {
          setBuilderOpen(false);
          setEditingRoutine(null);
        }}
        onSuccess={handleRoutineSaved}
      />

      {/* Starter Recommendation Modal */}
      <StarterRecommendationModal
        open={starterOpen}
        onClose={() => setStarterOpen(false)}
        onAdopted={handleRoutineSaved}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteConfirmRoutine)}
        onClose={() => !deleting && setDeleteConfirmRoutine(null)}
        disableRestoreFocus
      >
        <DialogTitle>Delete Workout Routine</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete{" "}
            <strong>{deleteConfirmRoutine?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <AppButton
            variant="outlined"
            onClick={() => setDeleteConfirmRoutine(null)}
            disabled={deleting}
          >
            Cancel
          </AppButton>
          <AppButton
            color="error"
            variant="contained"
            loading={deleting}
            onClick={handleDelete}
          >
            Delete Routine
          </AppButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RoutineManager;
