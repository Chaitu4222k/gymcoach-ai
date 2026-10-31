import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

function Item({ label, value }) {
  return (
    <Stack spacing={0.75}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>

      <Typography variant="body1" fontWeight={500}>
        {value || "-"}
      </Typography>
    </Stack>
  );
}

function ProfileView({ profile, user }) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Item label="Name" value={user?.name} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item label="Email" value={user?.email} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item
            label="Height"
            value={profile.height ? `${profile.height} cm` : "-"}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item
            label="Weight"
            value={profile.weight ? `${profile.weight} kg` : "-"}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item label="Fitness Goal" value={profile.fitnessGoal} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item
            label="Experience"
            value={
              profile.experienceMonths ? `${profile.experienceMonths} months` : "-"
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item
            label="Workout Days"
            value={
              profile.workoutDaysPerWeek
                ? `${profile.workoutDaysPerWeek} / week`
                : "-"
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item
            label="Workout Duration"
            value={
              profile.workoutDuration ? `${profile.workoutDuration} mins` : "-"
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item label="Diet Preference" value={profile.dietPreference} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item
            label="Average Sleep"
            value={
              profile.averageSleepHours ? `${profile.averageSleepHours} hrs` : "-"
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item label="Workout Location" value={profile.workoutLocation} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Item label="Activity Level" value={profile.activityLevel} />
        </Grid>
      </Grid>

      {profile.availableEquipment?.length > 0 && (
        <>
          <Divider />

          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Available Equipment
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {profile.availableEquipment.map((item) => (
                <Chip key={item} label={item} />
              ))}
            </Box>
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default ProfileView;