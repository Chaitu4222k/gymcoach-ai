import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import MetricCardsGrid from "../../components/dashboard/MetricCardsGrid";
import ActiveSplitWidget from "../../components/dashboard/ActiveSplitWidget";
import RecentActivityWidget from "../../components/dashboard/RecentActivityWidget";
import QuickNavGrid from "../../components/dashboard/QuickNavGrid";

import ProfileContainer from "../../components/profile/ProfileContainer";
import ExerciseExplorer from "../../components/exercises/ExerciseExplorer";
import RoutineManager from "../../components/routines/RoutineManager";
import ActiveWorkoutModal from "../../components/tracker/ActiveWorkoutModal";
import WorkoutHistoryModal from "../../components/tracker/WorkoutHistoryModal";

import { getDashboard } from "../../services/dashboardService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showError } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [profileOpen, setProfileOpen] = useState(false);
  const [exercisesOpen, setExercisesOpen] = useState(false);
  const [routinesOpen, setRoutinesOpen] = useState(false);
  const [activeWorkoutOpen, setActiveWorkoutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Prefilled workout session state
  const [activeSessionPreset, setActiveSessionPreset] = useState({
    routine: null,
    day: null,
  });

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDashboard();
      setDashboardData(res.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      showError("Could not refresh dashboard statistics");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    let ignore = false;
    getDashboard()
      .then((res) => {
        if (!ignore) {
          setDashboardData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load dashboard:", err);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleStartWorkout = () => {
    setActiveSessionPreset({ routine: null, day: null });
    setActiveWorkoutOpen(true);
  };

  const handleLaunchScheduledSession = (routine, day) => {
    setActiveSessionPreset({ routine, day });
    setActiveWorkoutOpen(true);
  };

  const handleWorkoutLogged = () => {
    fetchDashboard();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0F0F10",
        color: "#FFFFFF",
        pb: 8,
      }}
    >
      {/* Top Application Bar */}
      <Box
        sx={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          bgcolor: "rgba(18, 18, 18, 0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "1rem",
                  color: "#121212",
                }}
              >
                G
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ letterSpacing: "-0.02em", color: "#FFFFFF" }}
              >
                GymCoach AI
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => setProfileOpen(true)}
                sx={{ color: "text.secondary", "&:hover": { color: "#FFFFFF" } }}
                aria-label="Open Profile"
              >
                <AccountCircleRoundedIcon />
              </IconButton>

              <IconButton
                onClick={handleLogout}
                sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                aria-label="Logout"
              >
                <LogoutRoundedIcon />
              </IconButton>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Main Dashboard Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading && !dashboardData ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 16,
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Loading your fitness dashboard...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Header Greeting & Action */}
            <DashboardHeader
              user={user}
              summary={dashboardData?.userSummary}
              onStartWorkout={handleStartWorkout}
            />

            {/* Apple-inspired Metric Rings & Statistics */}
            <MetricCardsGrid
              weeklyStats={dashboardData?.weeklyStats}
              activeRoutine={dashboardData?.activeRoutine}
            />

            {/* Today's Scheduled Split Card */}
            <ActiveSplitWidget
              activeRoutine={dashboardData?.activeRoutine}
              onLaunchSession={handleLaunchScheduledSession}
              onOpenPlanner={() => setRoutinesOpen(true)}
            />

            {/* Recent Completed Activity Stream */}
            <RecentActivityWidget
              recentWorkouts={dashboardData?.recentWorkouts}
              onOpenHistory={() => setHistoryOpen(true)}
            />

            {/* Core Training Modules Navigation Grid */}
            <QuickNavGrid
              onOpenPlanner={() => setRoutinesOpen(true)}
              onOpenExercises={() => setExercisesOpen(true)}
              onOpenHistory={() => setHistoryOpen(true)}
              onOpenProfile={() => setProfileOpen(true)}
            />
          </>
        )}
      </Container>

      {/* Modals & Dialogs */}
      <ProfileContainer
        open={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          fetchDashboard();
        }}
      />

      <ExerciseExplorer
        open={exercisesOpen}
        onClose={() => setExercisesOpen(false)}
      />

      <RoutineManager
        open={routinesOpen}
        onClose={() => {
          setRoutinesOpen(false);
          fetchDashboard();
        }}
      />

      <ActiveWorkoutModal
        open={activeWorkoutOpen}
        initialRoutine={activeSessionPreset.routine}
        initialDay={activeSessionPreset.day}
        onClose={() => setActiveWorkoutOpen(false)}
        onWorkoutLogged={handleWorkoutLogged}
      />

      <WorkoutHistoryModal
        open={historyOpen}
        onClose={() => {
          setHistoryOpen(false);
          fetchDashboard();
        }}
      />
    </Box>
  );
}

export default Dashboard;
