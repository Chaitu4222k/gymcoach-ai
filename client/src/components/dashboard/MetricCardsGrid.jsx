import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";

function MetricCard({ title, value, subtitle, icon, progressPercent, color = "#4CAF50" }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.16)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              p: 0.75,
              borderRadius: 1.5,
              bgcolor: "rgba(255, 255, 255, 0.05)",
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: "#FFFFFF", lineHeight: 1.2, mb: 0.5 }}
        >
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>

      {progressPercent !== undefined && (
        <Box sx={{ mt: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
            <Typography variant="caption" color="text.secondary">
              Weekly Goal
            </Typography>
            <Typography variant="caption" fontWeight={600} color="primary.main">
              {progressPercent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "rgba(255, 255, 255, 0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                bgcolor: color,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

function MetricCardsGrid({ weeklyStats, activeRoutine }) {
  const completed = weeklyStats?.workoutsCompleted || 0;
  const target = weeklyStats?.targetWorkouts || 3;
  const percent = weeklyStats?.progressPercent || 0;
  const volume = weeklyStats?.volumeKg || 0;
  const total = weeklyStats?.totalWorkoutsAllTime || 0;

  return (
    <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Weekly Cadence"
          value={`${completed} / ${target}`}
          subtitle="Workouts completed this week"
          icon={<TrackChangesRoundedIcon fontSize="small" />}
          progressPercent={percent}
          color="#4CAF50"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Weekly Volume"
          value={`${volume.toLocaleString()} kg`}
          subtitle="Tonnage lifted this week"
          icon={<WhatshotRoundedIcon fontSize="small" />}
          color="#FF9800"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Total Sessions"
          value={`${total}`}
          subtitle="All-time workouts logged"
          icon={<FitnessCenterRoundedIcon fontSize="small" />}
          color="#2196F3"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Active Split"
          value={activeRoutine ? `${activeRoutine.daysPerWeek} Days` : "No Routine"}
          subtitle={activeRoutine?.name || "Create or adopt a routine"}
          icon={<CalendarTodayRoundedIcon fontSize="small" />}
          color="#AB47BC"
        />
      </Grid>
    </Grid>
  );
}

export default MetricCardsGrid;
