import Typography from "@mui/material/Typography";

function ProfileHeader({ user, isProfileCreated }) {
  return (
    <>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
      >
        {isProfileCreated ? "My Profile" : "Complete Your Profile"}
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        {user?.name}
        {user?.email ? ` • ${user.email}` : ""}
      </Typography>
    </>
  );
}

export default ProfileHeader;