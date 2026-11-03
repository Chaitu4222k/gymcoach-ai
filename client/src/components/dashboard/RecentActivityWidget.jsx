import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import AppButton from "../buttons/AppButton";

function RecentActivityWidget({ recentWorkouts = [], onOpenHistory }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        mb: 3.5,
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
          Recent Activity
        </Typography>

        <AppButton
          variant="text"
          size="small"
          endIcon={<HistoryRoundedIcon sx={{ fontSize: 16 }} />}
          onClick={onOpenHistory}
          sx={{ fontSize: "0.8rem", color: "text.secondary" }}
        >
          View Full History
        </AppButton>
      </Box>

      {recentWorkouts.length === 0 ? (
        <Box
          sx={{
            py: 3,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No completed workouts logged yet. Start a session to see your activity.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {recentWorkouts.map((workout) => {
            const formattedDate = new Date(workout.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <Box
                key={workout._id}
                sx={{
                  p: 1.75,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                  transition: "all 0.15s ease-in-out",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: "rgba(76, 175, 80, 0.12)",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FitnessCenterRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="#FFFFFF">
                      {workout.dayName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formattedDate} • {workout.routineName}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={`${workout.durationMinutes} mins`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.72rem",
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                    }}
                  />

                  <Chip
                    label={`${(workout.totalVolumeKg || 0).toLocaleString()} kg`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.72rem",
                      bgcolor: "rgba(76, 175, 80, 0.1)",
                      color: "#81C784",
                      fontWeight: 600,
                    }}
                  />

                  {workout.feeling && (
                    <Chip
                      label={workout.feeling}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.7rem",
                        bgcolor: "rgba(255, 255, 255, 0.04)",
                        color: "text.secondary",
                      }}
                    />
                  )}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

export default RecentActivityWidget;
