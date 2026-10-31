import Box from "@mui/material/Box";

function AppModalContent({
  children,
  scrollable = true,
  padding = 3,
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,

        display: "flex",
        flexDirection: "column",

        overflowY: scrollable ? "auto" : "hidden",
        overflowX: "hidden",

        px: {
          xs: 2,
          sm: padding,
        },

        py: 3,

        "&::-webkit-scrollbar": {
          width: 8,
        },

        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },

        "&::-webkit-scrollbar-thumb": {
          borderRadius: 10,
          bgcolor: "divider",
        },
      }}
    >
      {children}
    </Box>
  );
}

export default AppModalContent;