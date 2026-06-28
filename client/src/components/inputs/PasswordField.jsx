import { forwardRef, useState } from "react";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import AppTextField from "./AppTextField";

const PasswordField = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AppTextField
      ref={ref}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <VisibilityOff />
              ) : (
                <Visibility />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
});

PasswordField.displayName = "PasswordField";

export default PasswordField;