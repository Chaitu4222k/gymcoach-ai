import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import AppButton from "../components/buttons/AppButton";
import AuthLayout from "../components/layouts/AuthLayout";
import AppTextField from "../components/inputs/AppTextField";
import PasswordField from "../components/inputs/PasswordField";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      login(response.data.user, response.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <AuthLayout
      title="GymCoach AI"
      subtitle="Sign in to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <AppTextField
            label="Email"
            {...register("email", {
              required: "Email is required",
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <PasswordField
            label="Password"
            {...register("password", {
              required: "Password is required",
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <AppButton
            type="submit"
            loading={isSubmitting}
          >
            Login
          </AppButton>
        </Stack>
      </form>

      <Typography
        mt={3}
        align="center"
        color="text.secondary"
      >
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </Typography>
    </AuthLayout>
  );
}

export default Login;