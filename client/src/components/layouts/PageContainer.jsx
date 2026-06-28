import Box from "@mui/material/Box";

function PageContainer({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      {children}
    </Box>
  );
}

export default PageContainer;