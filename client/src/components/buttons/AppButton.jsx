import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function AppButton({
  children,
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <Button
      variant="contained"
      fullWidth
      size="large"
      disabled={loading || disabled}
      sx={{
        mt: 2,
        height: 48,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 600,
        fontSize: "1rem",
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={24}
          color="inherit"
        />
      ) : (
        children
      )}
    </Button>
  );
}

export default AppButton;