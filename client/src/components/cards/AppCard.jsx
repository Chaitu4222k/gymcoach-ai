import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function AppCard({
  title,
  subtitle,
  actions,
  children,
}) {
  return (
    <Card
      elevation={8}
      sx={{
        width: "100%",
        maxWidth: 450,
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {title && (
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            {title}
          </Typography>
        )}

        {subtitle && (
          <Typography
            color="text.secondary"
            mb={3}
          >
            {subtitle}
          </Typography>
        )}

        {children}

        {actions && (
          <Box mt={3}>
            {actions}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default AppCard;