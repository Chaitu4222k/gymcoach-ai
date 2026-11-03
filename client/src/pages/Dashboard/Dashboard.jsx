import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import AppButton from "../../components/buttons/AppButton";
import AuthLayout from "../../components/layouts/AuthLayout";
import ProfileContainer from "../../components/profile/ProfileContainer";
import ExerciseExplorer from "../../components/exercises/ExerciseExplorer";
import RoutineManager from "../../components/routines/RoutineManager";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [exercisesOpen, setExercisesOpen] = useState(false);
  const [routinesOpen, setRoutinesOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AuthLayout
      title={`Welcome, ${user?.name || "Athlete"}`}
      subtitle={user?.email}
    >
      <Typography mb={4} color="text.secondary">
        Manage your profile, browse exercises, plan training splits, and log your sessions.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 420,
          mx: "auto",
        }}
      >
        <AppButton
          variant="contained"
          size="large"
          startIcon={<CalendarMonthRoundedIcon />}
          onClick={() => setRoutinesOpen(true)}
        >
          Workout Planner
        </AppButton>

        <AppButton
          variant="outlined"
          size="large"
          startIcon={<FitnessCenterRoundedIcon />}
          onClick={() => setExercisesOpen(true)}
        >
          Exercise Library
        </AppButton>

        <AppButton
          variant="outlined"
          size="large"
          startIcon={<AccountCircleRoundedIcon />}
          onClick={() => setProfileOpen(true)}
        >
          My Profile
        </AppButton>

        <ProfileContainer
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
        />

        <ExerciseExplorer
          open={exercisesOpen}
          onClose={() => setExercisesOpen(false)}
        />

        <RoutineManager
          open={routinesOpen}
          onClose={() => setRoutinesOpen(false)}
        />

        <AppButton
          color="secondary"
          variant="text"
          startIcon={<LogoutRoundedIcon />}
          onClick={handleLogout}
          sx={{ mt: 1 }}
        >
          Logout
        </AppButton>
      </Box>
    </AuthLayout>
  );
}

export default Dashboard;
