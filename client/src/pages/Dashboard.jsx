import Typography from "@mui/material/Typography";

import AppButton from "../components/buttons/AppButton";
import AuthLayout from "../components/layouts/AuthLayout";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

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

      <AppButton onClick={handleLogout}>
        Logout
      </AppButton>
    </AuthLayout>
  );
}

export default Dashboard;