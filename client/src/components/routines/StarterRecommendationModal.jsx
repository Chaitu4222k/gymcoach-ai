import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";
import {
  getStarterRecommendation,
  createRoutine,
} from "../../services/routineService";
import { useToast } from "../../hooks/useToast";

function StarterRecommendationModal({ open, onClose, onAdopted }) {
  const { showSuccess, showError } = useToast();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adopting, setAdopting] = useState(false);

  useEffect(() => {
    if (!open) return;
    let ignore = false;

    getStarterRecommendation()
      .then((res) => {
        if (!ignore) {
          setRecommendation(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load recommendation:", err);
          showError("Failed to generate starter routine");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [open, showError]);

  const handleAdopt = async () => {
    if (!recommendation) return;
    try {
      setAdopting(true);
      const res = await createRoutine(recommendation);
      showSuccess("Starter routine adopted successfully as your active routine");
      onClose();
      onAdopted?.(res.data.routine);
    } catch (err) {
      console.error("Failed to adopt routine:", err);
      showError(err.response?.data?.message || "Failed to adopt starter routine");
    } finally {
      setAdopting(false);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Tailored Starter Routine"
      subtitle="Deterministic split recommendation based on your profile fitness goal and schedule"
      maxWidth="md"
      showFooter={true}
      footer={
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, width: "100%" }}>
          <AppButton variant="outlined" onClick={onClose} disabled={adopting}>
            Close
          </AppButton>
          <AppButton
            variant="contained"
            startIcon={<AutoAwesomeRoundedIcon />}
            onClick={handleAdopt}
            loading={adopting}
            disabled={!recommendation || loading}
          >
            Adopt as Active Routine
          </AppButton>
        </Box>
      }
    >
      <Box sx={{ py: 1 }}>
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
              Generating tailored starter program...
            </Typography>
          </Box>
        ) : recommendation ? (
          <Stack spacing={2.5}>
            {/* Header summary */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                bgcolor: "rgba(76, 175, 80, 0.05)",
                border: "1px solid rgba(76, 175, 80, 0.25)",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#FFFFFF" gutterBottom>
                {recommendation.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {recommendation.description}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<CalendarMonthRoundedIcon sx={{ fontSize: "14px !important" }} />}
                  label={`${recommendation.daysPerWeek} days / week`}
                  size="small"
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.05)", color: "#E0E0E0" }}
                />
                <Chip
                  label={recommendation.goal}
                  size="small"
                  sx={{
                    bgcolor: "rgba(33, 150, 243, 0.12)",
                    color: "#64B5F6",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={recommendation.difficulty}
                  size="small"
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.05)", color: "text.secondary" }}
                />
              </Stack>
            </Box>

            {/* Split Days Breakdown */}
            <Typography variant="subtitle1" fontWeight={600} color="#FFFFFF">
              Program Breakdown
            </Typography>

            <Stack spacing={1.5}>
              {recommendation.days?.map((day, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} color="#FFFFFF">
                      {day.name}
                    </Typography>
                    {day.isRestDay ? (
                      <Chip label="Rest Day" size="small" sx={{ fontSize: "0.72rem" }} />
                    ) : (
                      <Chip
                        label={`${day.exercises?.length || 0} exercises`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: "0.72rem" }}
                      />
                    )}
                  </Box>

                  {!day.isRestDay && day.exercises?.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {day.exercises.map((e) => e.exerciseName).join(" • ")}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Could not generate a recommendation at this time.
          </Typography>
        )}
      </Box>
    </AppModal>
  );
}

export default StarterRecommendationModal;
