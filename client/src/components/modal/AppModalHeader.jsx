import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

function AppModalHeader({ title, subtitle, actions, onClose }) {
  return (
    <>
      <Box
        sx={{
          px: 3,
          py: 2,
          flexShrink: 0,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                mt={0.5}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
            }}
          >
            {actions}

            <IconButton
              onClick={onClose}
              size="small"
              aria-label="Close dialog"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Divider />
    </>
  );
}

export default AppModalHeader;