import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PieChartOutlineRoundedIcon from "@mui/icons-material/PieChartOutlineRounded";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";
import {
  getBodyWeightLogs,
  logBodyWeight,
  deleteBodyWeightLog,
  getVolumeTrends,
  getMuscleDistribution,
} from "../../services/progressService";
import { useToast } from "../../hooks/useToast";

function WeightTrackerTab() {
  const { showSuccess, showError } = useToast();

  const [weightData, setWeightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reloadWeights = async () => {
    try {
      const res = await getBodyWeightLogs();
      setWeightData(res.data);
    } catch (err) {
      console.error("Failed to refresh weight logs:", err);
    }
  };

  useEffect(() => {
    let ignore = false;
    getBodyWeightLogs()
      .then((res) => {
        if (!ignore) {
          setWeightData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load weight logs:", err);
          showError("Failed to load weight history");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [showError]);

  const handleLogWeight = async (e) => {
    e.preventDefault();
    const numeric = Number(newWeight);
    if (!numeric || numeric < 25 || numeric > 350) {
      showError("Please enter a valid weight between 25 and 350 kg");
      return;
    }

    try {
      setSubmitting(true);
      await logBodyWeight({ weight: numeric, notes });
      showSuccess(`Logged weight: ${numeric} kg`);
      setNewWeight("");
      setNotes("");
      await reloadWeights();
    } catch (err) {
      console.error("Failed to log weight:", err);
      showError(err.response?.data?.message || "Failed to log body weight");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWeight = async (id) => {
    try {
      await deleteBodyWeightLog(id);
      showSuccess("Weight measurement deleted");
      await reloadWeights();
    } catch (err) {
      console.error("Failed to delete weight log:", err);
      showError("Failed to delete measurement");
    }
  };

  if (loading && !weightData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const current = weightData?.currentWeight;
  const starting = weightData?.startingWeight;
  const change = weightData?.netChange || 0;
  const logs = weightData?.logs || [];

  return (
    <Box>
      {/* Overview Stat Tiles */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Current Weight
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#FFFFFF">
              {current ? `${current} kg` : "—"}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Starting Weight
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#FFFFFF">
              {starting ? `${starting} kg` : "—"}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Net Change
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              {change > 0 ? (
                <TrendingUpRoundedIcon sx={{ color: "#FF9800", fontSize: 20 }} />
              ) : change < 0 ? (
                <TrendingDownRoundedIcon sx={{ color: "#4CAF50", fontSize: 20 }} />
              ) : null}
              <Typography variant="h5" fontWeight={700} color="#FFFFFF">
                {change > 0 ? `+${change}` : change} kg
              </Typography>
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Range (Low - High)
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#FFFFFF">
              {weightData?.lowestWeight && weightData?.highestWeight
                ? `${weightData.lowestWeight} - ${weightData.highestWeight}`
                : "—"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Log New Measurement Form */}
      <Box
        component="form"
        onSubmit={handleLogWeight}
        sx={{
          p: 2.5,
          borderRadius: 2.5,
          bgcolor: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          mb: 3,
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} color="#FFFFFF" sx={{ mb: 1.5 }}>
          Log Today's Body Weight
        </Typography>

        <Grid container spacing={1.5} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Weight (kg)"
              placeholder="e.g. 74.5"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              slotProps={{ htmlInput: { step: "0.1", min: 25, max: 350 } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth
              size="small"
              label="Notes (Optional)"
              placeholder="Morning fasted, post-cardio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <AppButton
              fullWidth
              type="submit"
              variant="contained"
              loading={submitting}
              disabled={!newWeight}
            >
              Save Entry
            </AppButton>
          </Grid>
        </Grid>
      </Box>

      {/* Measurement History Stream */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
        Measurement History ({logs.length})
      </Typography>

      {logs.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", textAlign: "center", py: 4 }}>
          No body weight entries recorded yet. Enter your current weight above to start tracking.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {[...logs].reverse().map((entry) => {
            const formatted = new Date(entry.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <Box
                key={entry._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600} color="#FFFFFF">
                    {entry.weight} kg
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatted} {entry.notes ? `• ${entry.notes}` : ""}
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  onClick={() => handleDeleteWeight(entry._id)}
                  sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

function VolumeTrendsTab() {
  const { showError } = useToast();
  const [trends, setTrends] = useState(null);
  const [timeframe, setTimeframe] = useState("4weeks");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    getVolumeTrends(timeframe)
      .then((res) => {
        if (!ignore) {
          setTrends(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load volume trends:", err);
          showError("Failed to load volume progression");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [timeframe, showError]);

  const maxVolume = trends?.weeks
    ? Math.max(1, ...trends.weeks.map((w) => w.volumeKg))
    : 1;

  return (
    <Box>
      {/* Timeframe Selector & Total Banner */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            TOTAL TONNAGE LIFTED
          </Typography>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            {(trends?.totalVolumeTonnage || 0).toLocaleString()} kg
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          {["4weeks", "8weeks", "12weeks"].map((tf) => (
            <Chip
              key={tf}
              label={tf === "4weeks" ? "4 Weeks" : tf === "8weeks" ? "8 Weeks" : "12 Weeks"}
              clickable
              color={timeframe === tf ? "primary" : "default"}
              variant={timeframe === tf ? "filled" : "outlined"}
              onClick={() => {
                setLoading(true);
                setTimeframe(tf);
              }}
              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
            />
          ))}
        </Stack>
      </Box>

      {/* Volume Bar Progression Chart */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : trends?.weeks?.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No workout volume recorded in this timeframe.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {trends?.weeks?.map((week, idx) => {
            const pct = Math.round((week.volumeKg / maxVolume) * 100);

            return (
              <Box
                key={idx}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
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
                    {week.label}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={`${week.workoutCount} workouts`}
                      size="small"
                      sx={{ height: 20, fontSize: "0.7rem", bgcolor: "rgba(255, 255, 255, 0.05)" }}
                    />
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {week.volumeKg.toLocaleString()} kg
                    </Typography>
                  </Stack>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "rgba(255, 255, 255, 0.06)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      bgcolor: "primary.main",
                    },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

function MuscleDistributionTab() {
  const { showError } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    getMuscleDistribution()
      .then((res) => {
        if (!ignore) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load muscle distribution:", err);
          showError("Failed to load muscle group distribution");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [showError]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          SETS RECORDED PAST 30 DAYS
        </Typography>
        <Typography variant="h4" fontWeight={700} color="#FFFFFF">
          {data?.totalSetsTracked || 0} total sets
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : data?.distribution?.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No exercise sets recorded in the past 30 days. Log your training sessions to see your muscular balance.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {data?.distribution?.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
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
                  {item.muscle}
                </Typography>
                <Typography variant="caption" fontWeight={700} color="primary.main">
                  {item.setCount} sets ({item.percentage}%)
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={item.percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(255, 255, 255, 0.06)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    bgcolor:
                      item.percentage > 25
                        ? "#4CAF50"
                        : item.percentage > 10
                        ? "#2196F3"
                        : "#AB47BC",
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function ProgressModal({ open, onClose }) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Performance & Progress Analytics"
      subtitle="Track body composition trajectory, volume progression, and muscular balance"
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
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          sx={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            mb: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 2,
            },
          }}
        >
          <Tab icon={<ScaleRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Body Weight" />
          <Tab icon={<BarChartRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Volume Progression" />
          <Tab icon={<PieChartOutlineRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Muscular Balance" />
        </Tabs>

        {tabIndex === 0 && <WeightTrackerTab />}
        {tabIndex === 1 && <VolumeTrendsTab />}
        {tabIndex === 2 && <MuscleDistributionTab />}
      </Box>
    </AppModal>
  );
}

export default ProgressModal;
