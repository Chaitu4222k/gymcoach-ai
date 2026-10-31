import { Controller } from "react-hook-form";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { AVAILABLE_EQUIPMENT } from "../../constants/profileConstants";

function ProfileEquipmentSelect({ control, errors }) {
  return (
    <Controller
      name="availableEquipment"
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <Box>
          <Typography variant="body2" fontWeight={600} mb={0.75}>
            Available Equipment
          </Typography>

          <Autocomplete
            multiple
            options={AVAILABLE_EQUIPMENT}
            value={Array.isArray(field.value) ? field.value : []}
            onChange={(_, value) => field.onChange(value)}
            disableCloseOnSelect
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                placeholder="Select available equipment"
                error={!!errors.availableEquipment}
                helperText={errors.availableEquipment?.message}
              />
            )}
          />
        </Box>
      )}
    />
  );
}

export default ProfileEquipmentSelect;