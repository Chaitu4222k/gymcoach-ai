import Dialog from "@mui/material/Dialog";

import AppModalHeader from "./AppModalHeader";
import AppModalContent from "./AppModalContent";
import AppModalFooter from "./AppModalFooter";

function AppModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "md",
  scrollable = true,
  showHeader = true,
  showFooter = false,
  headerActions,
  fullWidth = true,
  ...rest
}) {
  const handleClose = (_, reason) => {
    if (reason === "backdropClick") {
      return;
    }

    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      scroll="paper"
      {...rest}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            width: {
              xs: "95vw",
              sm: "90vw",
              md: "820px",
              lg: "860px",
            },
            maxWidth: maxWidth === "lg" ? "960px" : "860px",
            height: {
              xs: "95vh",
              sm: "90vh",
              md: "82vh",
            },
            maxHeight: "900px",
            m: {
              xs: 1,
              sm: 2,
            },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        },
      }}
    >
      {showHeader && (
        <AppModalHeader
          title={title}
          subtitle={subtitle}
          actions={headerActions}
          onClose={onClose}
        />
      )}

      <AppModalContent scrollable={scrollable}>
        {children}
      </AppModalContent>

      {showFooter && <AppModalFooter>{footer}</AppModalFooter>}
    </Dialog>
  );
}

export default AppModal;