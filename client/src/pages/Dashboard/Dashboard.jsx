import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AppButton from "../../components/buttons/AppButton";
import AuthLayout from "../../components/layouts/AuthLayout";

import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleProfile = () => {
    navigate("/profile");
  };

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
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <AppButton onClick={handleProfile}>
          My Profile
        </AppButton>

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