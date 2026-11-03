import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function NavTile({ title, description, icon, color = "#4CAF50", onClick }) {
  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.06)",
          borderColor: "rgba(255, 255, 255, 0.18)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
          "& .nav-arrow": {
            transform: "translateX(4px)",
            color: "#FFFFFF",
          },
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.25,
              borderRadius: 2,
              bgcolor: "rgba(255, 255, 255, 0.05)",
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>

          <ArrowForwardRoundedIcon
            className="nav-arrow"
            sx={{
              color: "text.secondary",
              fontSize: 18,
              transition: "transform 0.2s ease-in-out, color 0.2s ease-in-out",
            }}
          />
        </Box>

        <Typography variant="h6" fontWeight={600} color="#FFFFFF" gutterBottom>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

function QuickNavGrid({
  onOpenPlanner,
  onOpenExercises,
  onOpenHistory,
  onOpenProgress,
  onOpenProfile,
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" fontWeight={600} color="#FFFFFF" sx={{ mb: 2 }}>
        Training Modules
      </Typography>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <NavTile
            title="Workout Planner"
            description="Build splits, configure scheduled days, and adopt recommended routines."
            icon={<CalendarMonthRoundedIcon fontSize="small" />}
            color="#4CAF50"
            onClick={onOpenPlanner}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <NavTile
            title="Exercise Library"
            description="Explore 40+ canonical movements with instructions or add custom exercises."
            icon={<FitnessCenterRoundedIcon fontSize="small" />}
            color="#2196F3"
            onClick={onOpenExercises}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <NavTile
            title="Workout History"
            description="Review completed training logs, volume metrics, and individual set records."
            icon={<HistoryRoundedIcon fontSize="small" />}
            color="#FF9800"
            onClick={onOpenHistory}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <NavTile
            title="Progress & Body Analytics"
            description="Track body weight trajectory, weekly tonnage volume, and muscular balance."
            icon={<TrendingUpRoundedIcon fontSize="small" />}
            color="#00E676"
            onClick={onOpenProgress}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <NavTile
            title="Athlete Profile"
            description="Manage your physical metrics, available equipment, and fitness preferences."
            icon={<AccountCircleRoundedIcon fontSize="small" />}
            color="#AB47BC"
            onClick={onOpenProfile}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default QuickNavGrid;
