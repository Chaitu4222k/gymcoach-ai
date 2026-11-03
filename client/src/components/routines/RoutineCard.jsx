import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AppButton from "../buttons/AppButton";

function RoutineCard({
  routine,
  onViewSchedule,
  onEdit,
  onSetActive,
  onDelete,
}) {
  const totalExercises = routine.days?.reduce(
    (acc, day) => acc + (day.exercises?.length || 0),
    0
  );

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: routine.isActive
          ? "rgba(76, 175, 80, 0.05)"
          : "rgba(255, 255, 255, 0.03)",
        border: routine.isActive
          ? "1px solid rgba(76, 175, 80, 0.35)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          bgcolor: routine.isActive
            ? "rgba(76, 175, 80, 0.08)"
            : "rgba(255, 255, 255, 0.06)",
          borderColor: routine.isActive
            ? "rgba(76, 175, 80, 0.5)"
            : "rgba(255, 255, 255, 0.18)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        },
      }}
    >
      <Box>
        {/* Header row: Active status & Quick controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          {routine.isActive ? (
            <Chip
              icon={<CheckCircleRoundedIcon sx={{ fontSize: "14px !important" }} />}
              label="Active Plan"
              size="small"
              sx={{
                height: 22,
                fontSize: "0.72rem",
                fontWeight: 700,
                bgcolor: "rgba(76, 175, 80, 0.15)",
                color: "#81C784",
                border: "1px solid rgba(76, 175, 80, 0.4)",
              }}
            />
          ) : (
            <AppButton
              variant="text"
              size="small"
              startIcon={<RadioButtonUncheckedRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => onSetActive(routine)}
              sx={{
                fontSize: "0.72rem",
                p: 0,
                minWidth: 0,
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              Make Active
            </AppButton>
          )}

          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => onEdit(routine)}
              aria-label="Edit routine"
              sx={{ color: "text.secondary", "&:hover": { color: "#FFFFFF" } }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => onDelete(routine)}
              aria-label="Delete routine"
              sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {/* Routine Name */}
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ color: "#FFFFFF", lineHeight: 1.3, mb: 1 }}
        >
          {routine.name}
        </Typography>

        {routine.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {routine.description}
          </Typography>
        )}

        {/* Routine Metadata Badges */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          <Chip
            icon={<CalendarMonthRoundedIcon sx={{ fontSize: "14px !important" }} />}
            label={`${routine.daysPerWeek} days / week`}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              bgcolor: "rgba(255, 255, 255, 0.05)",
              color: "#E0E0E0",
            }}
          />

          <Chip
            label={routine.goal}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              bgcolor: "rgba(33, 150, 243, 0.1)",
              color: "#64B5F6",
              border: "1px solid rgba(33, 150, 243, 0.25)",
            }}
          />

          <Chip
            label={routine.difficulty}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              bgcolor: "rgba(255, 255, 255, 0.05)",
              color: "text.secondary",
            }}
          />

          <Chip
            label={`${totalExercises} exercises`}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              bgcolor: "rgba(255, 255, 255, 0.03)",
              color: "text.secondary",
            }}
          />
        </Stack>
      </Box>

      {/* Action */}
      <Box sx={{ pt: 1.5, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <AppButton
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => onViewSchedule(routine)}
          sx={{ fontSize: "0.82rem" }}
        >
          View Split & Exercises
        </AppButton>
      </Box>
    </Box>
  );
}

export default RoutineCard;
