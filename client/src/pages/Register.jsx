import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { registerUser } from "../services/authService";

import AppButton from "../components/buttons/AppButton";
import AuthLayout from "../components/layouts/AuthLayout";
import AppTextField from "../components/inputs/AppTextField";
import PasswordField from "../components/inputs/PasswordField";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      delete data.confirmPassword;

      await registerUser(data);

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your fitness journey"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <AppTextField
            label="Name"
            {...register("name", {
              required: "Name is required",
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <AppTextField
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <PasswordField
            label="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <PasswordField
            label="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <AppButton
            type="submit"
            loading={isSubmitting}
          >
            Register
          </AppButton>
        </Stack>
      </form>

      <Typography
        mt={3}
        align="center"
        color="text.secondary"
      >
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </Typography>
    </AuthLayout>
  );
}

export default Register;