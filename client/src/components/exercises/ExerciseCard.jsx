import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import AppButton from "../buttons/AppButton";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return {
        bg: "rgba(76, 175, 80, 0.12)",
        color: "#81C784",
        border: "rgba(76, 175, 80, 0.3)",
      };
    case "Intermediate":
      return {
        bg: "rgba(255, 152, 0, 0.12)",
        color: "#FFB74D",
        border: "rgba(255, 152, 0, 0.3)",
      };
    case "Advanced":
      return {
        bg: "rgba(171, 71, 188, 0.12)",
        color: "#BA68C8",
        border: "rgba(171, 71, 188, 0.3)",
      };
    default:
      return {
        bg: "rgba(255, 255, 255, 0.08)",
        color: "#B0B0B0",
        border: "rgba(255, 255, 255, 0.15)",
      };
  }
};

function ExerciseCard({ exercise, onViewDetails, onDeleteCustom }) {
  const diffStyle = getDifficultyColor(exercise.difficulty);

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
          bgcolor: "rgba(255, 255, 255, 0.06)",
          borderColor: "rgba(255, 255, 255, 0.18)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        },
      }}
    >
      <Box>
        {/* Header row: Category / Custom tag & Delete button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                color: "text.secondary",
              }}
            >
              {exercise.category}
            </Typography>

            {exercise.isCustom && (
              <Chip
                label="Custom"
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  bgcolor: "rgba(33, 150, 243, 0.12)",
                  color: "#64B5F6",
                  border: "1px solid rgba(33, 150, 243, 0.3)",
                }}
              />
            )}
          </Stack>

          {exercise.isCustom && onDeleteCustom && (
            <IconButton
              size="small"
              onClick={() => onDeleteCustom(exercise)}
              aria-label={`Delete custom exercise ${exercise.name}`}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "error.main" },
              }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Exercise Name */}
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            color: "#FFFFFF",
            lineHeight: 1.3,
            mb: 1.5,
          }}
        >
          {exercise.name}
        </Typography>

        {/* Primary Muscle & Equipment tags */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          <Chip
            icon={<FitnessCenterRoundedIcon sx={{ fontSize: "14px !important" }} />}
            label={exercise.primaryMuscle}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 500,
              bgcolor: "rgba(255, 255, 255, 0.06)",
              color: "#E0E0E0",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />

          <Chip
            label={exercise.equipment}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 500,
              bgcolor: "rgba(255, 255, 255, 0.04)",
              color: "text.secondary",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          />

          <Chip
            label={exercise.difficulty}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 600,
              bgcolor: diffStyle.bg,
              color: diffStyle.color,
              border: `1px solid ${diffStyle.border}`,
            }}
          />
        </Stack>
      </Box>

      {/* Card Action */}
      <Box sx={{ pt: 1, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <AppButton
          variant="text"
          size="small"
          fullWidth
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => onViewDetails(exercise)}
          sx={{
            justifyContent: "center",
            color: "text.secondary",
            fontSize: "0.82rem",
            "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.05)" },
          }}
        >
          View Instructions
        </AppButton>
      </Box>
    </Box>
  );
}

export default ExerciseCard;
