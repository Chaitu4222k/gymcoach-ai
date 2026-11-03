import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListOffRoundedIcon from "@mui/icons-material/FilterListOffRounded";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AppButton from "../buttons/AppButton";

function ExerciseFilters({
  filters,
  onChange,
  onReset,
  options,
  resultCount,
}) {
  const isFiltered = Boolean(
    filters.search ||
      filters.primaryMuscle ||
      filters.equipment ||
      filters.category ||
      filters.difficulty ||
      filters.isCustom
  );

  const handleFieldChange = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search bar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search exercises by name..."
            value={filters.search || ""}
            onChange={(e) => handleFieldChange("search", e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        {/* Primary Muscle */}
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Muscle Group"
            value={filters.primaryMuscle || ""}
            onChange={(e) => handleFieldChange("primaryMuscle", e.target.value)}
          >
            <MenuItem value="">All Muscles</MenuItem>
            {options?.muscleGroups?.map((muscle) => (
              <MenuItem key={muscle} value={muscle}>
                {muscle}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Equipment */}
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Equipment"
            value={filters.equipment || ""}
            onChange={(e) => handleFieldChange("equipment", e.target.value)}
          >
            <MenuItem value="">All Equipment</MenuItem>
            {options?.equipment?.map((eq) => (
              <MenuItem key={eq} value={eq}>
                {eq}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Category */}
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Category"
            value={filters.category || ""}
            onChange={(e) => handleFieldChange("category", e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {options?.categories?.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Difficulty */}
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Difficulty"
            value={filters.difficulty || ""}
            onChange={(e) => handleFieldChange("difficulty", e.target.value)}
          >
            <MenuItem value="">All Difficulties</MenuItem>
            {options?.difficultyLevels?.map((diff) => (
              <MenuItem key={diff} value={diff}>
                {diff}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Quick Filter Badges & Count Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mt: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip
            label="Custom Only"
            clickable
            variant={filters.isCustom === "true" ? "filled" : "outlined"}
            color={filters.isCustom === "true" ? "primary" : "default"}
            onClick={() =>
              handleFieldChange(
                "isCustom",
                filters.isCustom === "true" ? "" : "true"
              )
            }
            sx={{
              fontWeight: 500,
              fontSize: "0.8rem",
              borderRadius: "8px",
            }}
          />

          {isFiltered && (
            <AppButton
              variant="text"
              size="small"
              startIcon={<FilterListOffRoundedIcon />}
              onClick={onReset}
              sx={{
                fontSize: "0.78rem",
                color: "text.secondary",
                "&:hover": { color: "#FFFFFF" },
              }}
            >
              Reset Filters
            </AppButton>
          )}
        </Stack>

        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
          {resultCount} {resultCount === 1 ? "exercise" : "exercises"} found
        </Typography>
      </Box>
    </Box>
  );
}

export default ExerciseFilters;
