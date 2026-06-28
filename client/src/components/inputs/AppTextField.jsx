import React from "react";
import TextField from "@mui/material/TextField";

const AppTextField = React.forwardRef((props, ref) => {
  return (
    <TextField
      ref={ref}
      fullWidth
      variant="outlined"
      margin="normal"
      size="medium"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
      {...props}
    />
  );
});

AppTextField.displayName = "AppTextField";

export default AppTextField;