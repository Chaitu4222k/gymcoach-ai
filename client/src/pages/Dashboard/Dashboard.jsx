import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AppButton from "../../components/buttons/AppButton";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useState } from "react";
import ProfileContainer from "../../components/profile/ProfileContainer";

import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AuthLayout
      title={`Welcome ${user?.name}`}
      subtitle={user?.email}
    >
      <Typography mb={4}>
        Authentication completed successfully.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <AppButton onClick={() => setProfileOpen(true)}>
          My Profile
        </AppButton>

        <ProfileContainer
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
        />

        <AppButton
          color="secondary"
          onClick={handleLogout}
        >
          Logout
        </AppButton>
      </Box>
    </AuthLayout>
  );
}

export default Dashboard;