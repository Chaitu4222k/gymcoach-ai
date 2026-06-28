import { createTheme } from "@mui/material/styles";
import colors from "./colors";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: colors.primary,
    },

    secondary: {
      main: colors.secondary,
    },

    background: {
      default: colors.background,
      paper: colors.card,
    },

    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
  },
});

export default theme;