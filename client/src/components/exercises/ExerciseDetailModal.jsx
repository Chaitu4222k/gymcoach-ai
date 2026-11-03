import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";

function ExerciseDetailModal({ open, exercise, onClose }) {
  if (!exercise) return null;

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={exercise.name}
      subtitle={exercise.category}
      maxWidth="sm"
      showFooter={true}
      footer={
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <AppButton variant="outlined" onClick={onClose}>
            Close
          </AppButton>
        </Box>
      }
    >
      <Stack spacing={3} sx={{ py: 1 }}>
        {/* Muscle & Equipment attributes */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "text.secondary",
              fontWeight: 700,
              display: "block",
              mb: 1.5,
            }}
          >
            Target & Equipment
          </Typography>

          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Primary Muscle
              </Typography>
              <Chip
                label={exercise.primaryMuscle}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Secondary Muscles
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {exercise.secondaryMuscles.map((m) => (
                    <Chip
                      key={m}
                      label={m}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        fontSize: "0.75rem",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Equipment
              </Typography>
              <Typography variant="body2" fontWeight={600} color="#FFFFFF">
                {exercise.equipment}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Difficulty
              </Typography>
              <Typography variant="body2" fontWeight={600} color="#FFFFFF">
                {exercise.difficulty}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Step-by-step instructions */}
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="#FFFFFF"
            sx={{ mb: 2 }}
          >
            Execution Steps
          </Typography>

          {exercise.instructions && exercise.instructions.length > 0 ? (
            <Stack spacing={2}>
              {exercise.instructions.map((step, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 26,
                      height: 26,
                      borderRadius: "50%",
                      bgcolor: "rgba(76, 175, 80, 0.15)",
                      color: "#81C784",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </Box>

                  <Typography
                    variant="body2"
                    color="#E0E0E0"
                    sx={{ lineHeight: 1.6, pt: 0.2 }}
                  >
                    {step}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              No step-by-step instructions recorded for this exercise.
            </Typography>
          )}
        </Box>
      </Stack>
    </AppModal>
  );
}

export default ExerciseDetailModal;
