import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";

function RoutineDaySchedule({ open, routine, onClose }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!routine) return null;

  const currentDay = routine.days?.[selectedDayIndex] || routine.days?.[0];

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={routine.name}
      subtitle={`${routine.goal} • ${routine.daysPerWeek} days/week • ${routine.difficulty}`}
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
        {routine.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {routine.description}
          </Typography>
        )}

        {/* Day selection tabs */}
        {routine.days && routine.days.length > 0 ? (
          <>
            <Tabs
              value={selectedDayIndex}
              onChange={(_, val) => setSelectedDayIndex(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                mb: 3,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  minWidth: "auto",
                  px: 2,
                },
              }}
            >
              {routine.days.map((day, idx) => (
                <Tab
                  key={idx}
                  label={day.isRestDay ? `Day ${day.dayNumber}: Rest` : `Day ${day.dayNumber}`}
                />
              ))}
            </Tabs>

            {/* Current day details */}
            {currentDay && (
              <Box>
                {/* Day Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 2.5,
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="#FFFFFF">
                      {currentDay.name}
                    </Typography>

                    {currentDay.targetMuscleGroups?.length > 0 && (
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
                        {currentDay.targetMuscleGroups.map((muscle) => (
                          <Chip
                            key={muscle}
                            label={muscle}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.72rem",
                              bgcolor: "rgba(255, 255, 255, 0.05)",
                            }}
                          />
                        ))}
                      </Stack>
                    )}
                  </Box>

                  {currentDay.isRestDay ? (
                    <Chip
                      icon={<BedtimeOutlinedIcon sx={{ fontSize: "14px !important" }} />}
                      label="Rest & Recovery"
                      sx={{
                        bgcolor: "rgba(33, 150, 243, 0.12)",
                        color: "#64B5F6",
                        fontWeight: 600,
                      }}
                    />
                  ) : (
                    <Chip
                      label={`${currentDay.exercises?.length || 0} exercises`}
                      sx={{
                        bgcolor: "rgba(76, 175, 80, 0.12)",
                        color: "#81C784",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>

                {/* Day Content */}
                {currentDay.isRestDay ? (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: 3,
                      bgcolor: "rgba(255, 255, 255, 0.02)",
                      border: "1px dashed rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <BedtimeOutlinedIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1.5 }} />
                    <Typography variant="subtitle1" fontWeight={600} color="#FFFFFF" gutterBottom>
                      Active Recovery Day
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: "auto" }}>
                      Take time to rest, hydrate, stretch, or do light mobility work. Proper recovery allows your muscles to repair and adapt.
                    </Typography>
                  </Box>
                ) : currentDay.exercises && currentDay.exercises.length > 0 ? (
                  <Stack spacing={1.5}>
                    {currentDay.exercises.map((ex, exIdx) => (
                      <Box
                        key={exIdx}
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          bgcolor: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              bgcolor: "rgba(255, 255, 255, 0.06)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              color: "primary.main",
                            }}
                          >
                            {exIdx + 1}
                          </Box>

                          <Box>
                            <Typography variant="body1" fontWeight={600} color="#FFFFFF">
                              {ex.exerciseName}
                            </Typography>
                            {ex.notes && (
                              <Typography variant="caption" color="text.secondary">
                                {ex.notes}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Chip
                            icon={<FitnessCenterRoundedIcon sx={{ fontSize: "14px !important" }} />}
                            label={`${ex.targetSets} sets × ${ex.targetRepsMin}-${ex.targetRepsMax} reps`}
                            size="small"
                            sx={{
                              bgcolor: "rgba(255, 255, 255, 0.05)",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />

                          {ex.restSeconds && (
                            <Chip
                              icon={<TimerOutlinedIcon sx={{ fontSize: "14px !important" }} />}
                              label={`${ex.restSeconds}s rest`}
                              size="small"
                              sx={{
                                bgcolor: "rgba(255, 255, 255, 0.03)",
                                fontSize: "0.72rem",
                                color: "text.secondary",
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                    No exercises scheduled for this day.
                  </Typography>
                )}
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            This routine does not have any scheduled days.
          </Typography>
        )}
      </Box>
    </AppModal>
  );
}

export default RoutineDaySchedule;
