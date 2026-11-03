import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";
import ExerciseCard from "./ExerciseCard";
import ExerciseFilters from "./ExerciseFilters";
import ExerciseDetailModal from "./ExerciseDetailModal";
import CustomExerciseModal from "./CustomExerciseModal";
import {
  getExercises,
  getExerciseOptions,
  deleteCustomExercise,
} from "../../services/exerciseService";
import { useToast } from "../../hooks/useToast";

const DEFAULT_FILTERS = {
  search: "",
  primaryMuscle: "",
  equipment: "",
  category: "",
  difficulty: "",
  isCustom: "",
};

function ExerciseExplorer({ open, onClose }) {
  const { showSuccess, showError } = useToast();

  const [exercises, setExercises] = useState([]);
  const [options, setOptions] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteConfirmExercise, setDeleteConfirmExercise] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load options once when modal opens
  useEffect(() => {
    if (!open) return;

    let mounted = true;
    getExerciseOptions()
      .then((res) => {
        if (mounted) setOptions(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch exercise options:", err);
      });

    return () => {
      mounted = false;
    };
  }, [open]);

  // Load exercises whenever filters change or modal is open
  useEffect(() => {
    if (!open) return;

    let ignore = false;
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.primaryMuscle) params.primaryMuscle = filters.primaryMuscle;
    if (filters.equipment) params.equipment = filters.equipment;
    if (filters.category) params.category = filters.category;
    if (filters.difficulty) params.difficulty = filters.difficulty;
    if (filters.isCustom) params.isCustom = filters.isCustom;

    getExercises(params)
      .then((res) => {
        if (!ignore) {
          setExercises(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load exercises:", err);
          showError("Failed to load exercises");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [open, filters, showError]);

  const handleFilterChange = (newFilters) => {
    setLoading(true);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setLoading(true);
    setFilters(DEFAULT_FILTERS);
  };

  const handleCustomCreated = (newExercise) => {
    setExercises((prev) => [newExercise, ...prev]);
  };

  const handleDeleteExercise = async () => {
    if (!deleteConfirmExercise) return;
    try {
      setDeleting(true);
      await deleteCustomExercise(deleteConfirmExercise._id);
      showSuccess("Custom exercise deleted successfully");
      setExercises((prev) =>
        prev.filter((ex) => ex._id !== deleteConfirmExercise._id)
      );
      setDeleteConfirmExercise(null);
    } catch (err) {
      console.error("Failed to delete exercise:", err);
      showError(err.response?.data?.message || "Failed to delete exercise");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AppModal
        open={open}
        onClose={onClose}
        title="Exercise Library"
        subtitle="Explore canonical movements or create custom exercises tailored to your routine."
        maxWidth="lg"
        disableEnforceFocus={Boolean(deleteConfirmExercise || customModalOpen || selectedExercise)}
        headerActions={
          <AppButton
            variant="contained"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={() => setCustomModalOpen(true)}
            sx={{ fontWeight: 600 }}
          >
            New Custom Exercise
          </AppButton>
        }
      >
        <Box sx={{ py: 1 }}>
          {/* Filters Bar */}
          <ExerciseFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            options={options}
            resultCount={exercises.length}
          />

          {/* Content state */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 10,
                gap: 2,
              }}
            >
              <CircularProgress size={36} />
              <Typography variant="body2" color="text.secondary">
                Loading exercise library...
              </Typography>
            </Box>
          ) : exercises.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                px: 2,
                borderRadius: 3,
                bgcolor: "rgba(255, 255, 255, 0.02)",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
            >
              <SearchOffRoundedIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 1.5, opacity: 0.6 }}
              />
              <Typography variant="h6" fontWeight={600} color="#FFFFFF" gutterBottom>
                No exercises found
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 400, mb: 2.5 }}
              >
                No exercises matched your current filters. Try resetting the filters or add a new custom exercise.
              </Typography>
              <AppButton variant="outlined" size="small" onClick={handleResetFilters}>
                Clear All Filters
              </AppButton>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {exercises.map((exercise) => (
                <Grid key={exercise._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ExerciseCard
                    exercise={exercise}
                    onViewDetails={setSelectedExercise}
                    onDeleteCustom={setDeleteConfirmExercise}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </AppModal>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        open={Boolean(selectedExercise)}
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />

      {/* Create Custom Exercise Modal */}
      <CustomExerciseModal
        open={customModalOpen}
        options={options}
        onClose={() => setCustomModalOpen(false)}
        onSuccess={handleCustomCreated}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteConfirmExercise)}
        onClose={() => !deleting && setDeleteConfirmExercise(null)}
        disableRestoreFocus
      >
        <DialogTitle>Delete Custom Exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete{" "}
            <strong>{deleteConfirmExercise?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <AppButton
            variant="outlined"
            onClick={() => setDeleteConfirmExercise(null)}
            disabled={deleting}
          >
            Cancel
          </AppButton>
          <AppButton
            color="error"
            variant="contained"
            loading={deleting}
            onClick={handleDeleteExercise}
          >
            Delete Exercise
          </AppButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ExerciseExplorer;
