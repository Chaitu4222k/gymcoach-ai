import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";

import AppModal from "../modal/AppModal";
import AppButton from "../buttons/AppButton";
import { changePassword } from "../../services/authService";
import { updatePreferences } from "../../services/profileService";
import { useToast } from "../../hooks/useToast";

function AccountSecurityTab() {
  const { showSuccess, showError } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showError("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      showError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await changePassword({ currentPassword, newPassword });
      showSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to change password:", err);
      showError(err.response?.data?.message || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ py: 1 }}>
      <Typography variant="subtitle1" fontWeight={600} color="#FFFFFF" sx={{ mb: 1 }}>
        Update Password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ensure your account uses a strong, unique password of at least 8 characters.
      </Typography>

      <Stack spacing={2.5} sx={{ maxWidth: 440 }}>
        <TextField
          fullWidth
          size="small"
          type="password"
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />

        <TextField
          fullWidth
          size="small"
          type="password"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          helperText="Minimum 8 characters"
        />

        <TextField
          fullWidth
          size="small"
          type="password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        <Box sx={{ pt: 1 }}>
          <AppButton type="submit" variant="contained" loading={submitting}>
            Update Password
          </AppButton>
        </Box>
      </Stack>
    </Box>
  );
}

function PreferencesTab() {
  const { showSuccess, showError } = useToast();

  const [weightUnit, setWeightUnit] = useState("kg");
  const [restTimerSound, setRestTimerSound] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSavePreferences = async () => {
    try {
      setSubmitting(true);
      await updatePreferences({
        weightUnit,
        restTimerSound,
      });
      showSuccess("Preferences saved successfully");
    } catch (err) {
      console.error("Failed to update preferences:", err);
      showError("Failed to update preferences");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="subtitle1" fontWeight={600} color="#FFFFFF" sx={{ mb: 1 }}>
        App & Unit Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Customize units of measurement and interactive training cues.
      </Typography>

      <Stack spacing={3} sx={{ maxWidth: 440 }}>
        {/* Weight Unit */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 1 }}>
            PREFERRED WEIGHT UNIT
          </Typography>
          <ToggleButtonGroup
            value={weightUnit}
            exclusive
            onChange={(_, val) => val && setWeightUnit(val)}
            size="small"
          >
            <ToggleButton value="kg" sx={{ px: 3, fontWeight: 600 }}>
              Kilograms (kg)
            </ToggleButton>
            <ToggleButton value="lbs" sx={{ px: 3, fontWeight: 600 }}>
              Pounds (lbs)
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Rest Timer Audio Toggle */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
            AUDIO NOTIFICATIONS
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={restTimerSound}
                onChange={(e) => setRestTimerSound(e.target.checked)}
              />
            }
            label="Play chime when rest timer concludes"
          />
        </Box>

        {/* Theme Indicator */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
            COLOR THEME
          </Typography>
          <Chip label="Apple OLED Dark (Default)" size="small" sx={{ fontWeight: 600 }} />
        </Box>

        <Box sx={{ pt: 1 }}>
          <AppButton onClick={handleSavePreferences} loading={submitting}>
            Save Preferences
          </AppButton>
        </Box>
      </Stack>
    </Box>
  );
}

function AIStatusTab() {
  const pendingEndpoints = [
    {
      endpoint: "POST /api/ai/generate-plan",
      title: "AI Workout Plan Generator",
      status: "Phase 2 Boundary",
      description: "Generates personalized workout routines using LLM reasoning over profile habits and equipment.",
    },
    {
      endpoint: "POST /api/ai/chat",
      title: "Conversational AI Coach",
      status: "Phase 2 Boundary",
      description: "Contextual assistant for form advice, rep adjustments, and training feedback.",
    },
    {
      endpoint: "GET /api/ai/daily-summary",
      title: "AI Daily Summary",
      status: "Phase 2 Boundary",
      description: "Natural language synthesis of daily workout adherence and recovery score.",
    },
    {
      endpoint: "GET /api/ai/insights",
      title: "AI Performance Insights",
      status: "Phase 2 Boundary",
      description: "Predictive volume recovery suggestions and fatigue monitoring.",
    },
  ];

  return (
    <Box sx={{ py: 1 }}>
      {/* Boundary Overview Banner */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: 2.5,
          bgcolor: "rgba(33, 150, 243, 0.08)",
          border: "1px solid rgba(33, 150, 243, 0.25)",
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <SecurityRoundedIcon sx={{ color: "#64B5F6", mt: 0.2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#FFFFFF" gutterBottom>
              Two-Phase Architecture Separation
            </Typography>
            <Typography variant="body2" color="#E0E0E0" sx={{ lineHeight: 1.6 }}>
              Phase 1 establishes the 100% complete, non-AI application foundation (database, catalog, planner, live tracker, dashboard, and analytics).
              AI microservices are strictly isolated and returning HTTP 501 Not Implemented contracts to guarantee zero false mocks before collaborative Phase 2 engineering begins.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Contract List */}
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 1.5 }}>
        PENDING AI INTEGRATION CONTRACTS
      </Typography>

      <Stack spacing={1.5}>
        {pendingEndpoints.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
              <Typography variant="subtitle2" fontWeight={600} color="#FFFFFF">
                {item.title}
              </Typography>
              <Chip
                icon={<HourglassEmptyRoundedIcon sx={{ fontSize: "14px !important" }} />}
                label={item.status}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 152, 0, 0.12)",
                  color: "#FFB74D",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                }}
              />
            </Box>

            <Typography variant="caption" sx={{ fontFamily: "monospace", color: "primary.main", display: "block", mb: 0.5 }}>
              {item.endpoint} (HTTP 501 Contract)
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function SettingsModal({ open, onClose }) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Settings & Account"
      subtitle="Manage account security, application preferences, and view AI architecture status"
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
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          sx={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            mb: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 2,
            },
          }}
        >
          <Tab icon={<LockResetRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Account Security" />
          <Tab icon={<TuneRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Preferences" />
          <Tab icon={<SmartToyOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="AI Architecture Status" />
        </Tabs>

        {tabIndex === 0 && <AccountSecurityTab />}
        {tabIndex === 1 && <PreferencesTab />}
        {tabIndex === 2 && <AIStatusTab />}
      </Box>
    </AppModal>
  );
}

export default SettingsModal;
