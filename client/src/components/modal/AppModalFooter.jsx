import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

function AppModalFooter({
  children,
  justifyContent = "flex-end",
}) {
  return (
    <>
      <Divider />

      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent,
          alignItems: "center",
          gap: 2,
          flexShrink: 0,
          bgcolor: "background.paper",
        }}
      >
        {children}
      </Box>
    </>
  );
}

export default AppModalFooter;