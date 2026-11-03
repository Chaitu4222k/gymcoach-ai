import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import AppButton from "../buttons/AppButton";

function DashboardHeader({ user, summary, onStartWorkout }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 3.5,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Welcome back, {user?.name || "Athlete"}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <Chip
            icon={<FitnessCenterRoundedIcon sx={{ fontSize: "14px !important" }} />}
            label={summary?.fitnessGoal || "Build Muscle"}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
          />

          {summary?.targetDaysPerWeek && (
            <Chip
              label={`${summary.targetDaysPerWeek} days / week goal`}
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.05)",
                color: "text.secondary",
                fontSize: "0.75rem",
              }}
            />
          )}
        </Stack>
      </Box>

      <AppButton
        variant="contained"
        size="large"
        startIcon={<PlayCircleOutlineRoundedIcon />}
        onClick={onStartWorkout}
        sx={{
          py: 1.2,
          px: 3,
          fontWeight: 700,
          boxShadow: "0 4px 20px rgba(76, 175, 80, 0.35)",
        }}
      >
        Start Workout
      </AppButton>
    </Box>
  );
}

export default DashboardHeader;
