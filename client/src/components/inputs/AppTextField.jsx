import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const blockedKeys = ["-", "+", "e", "E"];

const AppTextField = React.forwardRef((props, ref) => {
  const {
    label,
    placeholder,
    onKeyDown,
    inputProps,
    type,
    sx,
    slotProps,
    ...rest
  } = props;

  const handleKeyDown = (event) => {
    if (type === "number" && blockedKeys.includes(event.key)) {
      event.preventDefault();
      return;
    }

    onKeyDown?.(event);
  };

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          fontWeight={600}
          mb={0.75}
        >
          {label}
        </Typography>
      )}

      <TextField
        ref={ref}
        fullWidth
        variant="outlined"
        size="small"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        type={type}
        slotProps={{
          htmlInput: inputProps,
          inputLabel: {
            shrink: false,
          },
          ...slotProps,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 48,
            borderRadius: 2,
          },
          ...sx,
        }}
        {...rest}
      />
    </Box>
  );
});

AppTextField.displayName = "AppTextField";

export default AppTextField;