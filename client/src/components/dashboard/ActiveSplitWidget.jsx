import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import AppButton from "../buttons/AppButton";

function ActiveSplitWidget({ activeRoutine, onLaunchSession, onOpenPlanner }) {
  if (!activeRoutine) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "rgba(255, 255, 255, 0.02)",
          border: "1px dashed rgba(255, 255, 255, 0.12)",
          textAlign: "center",
          mb: 3.5,
        }}
      >
        <CalendarMonthRoundedIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1, opacity: 0.6 }} />
        <Typography variant="h6" fontWeight={600} color="#FFFFFF" gutterBottom>
          No Active Routine Configured
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: "auto", mb: 2.5 }}>
          Set up your weekly workout routine or adopt a tailored starter program to track your daily split.
        </Typography>
        <AppButton
          variant="contained"
          size="small"
          startIcon={<AddCircleOutlineRoundedIcon />}
          onClick={onOpenPlanner}
        >
          Open Workout Planner
        </AppButton>
      </Box>
    );
  }

  const suggested = activeRoutine.suggestedDay;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        mb: 3.5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              Today's Scheduled Split
            </Typography>

            <Chip
              label={activeRoutine.name}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.68rem",
                bgcolor: "rgba(255, 255, 255, 0.05)",
                color: "text.secondary",
              }}
            />
          </Stack>

          <Typography variant="h5" fontWeight={700} color="#FFFFFF">
            {suggested?.name || "Scheduled Workout"}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <AppButton
            variant="outlined"
            size="small"
            startIcon={<CalendarMonthRoundedIcon />}
            onClick={onOpenPlanner}
          >
            Manage Split
          </AppButton>

          {suggested && !suggested.isRestDay && (
            <AppButton
              variant="contained"
              size="small"
              startIcon={<PlayCircleOutlineRoundedIcon />}
              onClick={() => onLaunchSession(activeRoutine, suggested)}
              sx={{ fontWeight: 600 }}
            >
              Start Today's Workout
            </AppButton>
          )}
        </Stack>
      </Box>

      {/* Suggested Day Content */}
      {suggested?.isRestDay ? (
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: "rgba(33, 150, 243, 0.06)",
            border: "1px solid rgba(33, 150, 243, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <BedtimeOutlinedIcon sx={{ color: "#64B5F6", fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="#FFFFFF">
              Scheduled Rest & Recovery Day
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No heavy lifting scheduled today. Focus on restful sleep, mobility, and proper nutrition.
            </Typography>
          </Box>
        </Box>
      ) : suggested?.exercises && suggested.exercises.length > 0 ? (
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
            SCHEDULED MOVEMENTS ({suggested.exercises.length})
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {suggested.exercises.map((ex, idx) => (
              <Chip
                key={idx}
                label={`${ex.exerciseName} (${ex.targetSets} × ${ex.targetRepsMin}-${ex.targetRepsMax})`}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  color: "#E0E0E0",
                  fontSize: "0.75rem",
                }}
              />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}

export default ActiveSplitWidget;
