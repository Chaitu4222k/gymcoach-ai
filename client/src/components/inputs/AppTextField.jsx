import React from "react";
import TextField from "@mui/material/TextField";

const blockedKeys = ["-", "+", "e", "E"];

const AppTextField = React.forwardRef((props, ref) => {
  const { onKeyDown, inputProps, type, ...rest } = props;

  const handleKeyDown = (event) => {
    if (type === "number" && blockedKeys.includes(event.key)) {
      event.preventDefault();
      return;
    }

    if (typeof onKeyDown === "function") {
      onKeyDown(event);
    }
  };

  return (
    <TextField
      ref={ref}
      fullWidth
      variant="outlined"
      margin="normal"
      size="medium"
      onKeyDown={handleKeyDown}
      inputProps={{
        ...inputProps,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
      {...rest}
      type={type}
    />
  );
});

AppTextField.displayName = "AppTextField";

export default AppTextField;