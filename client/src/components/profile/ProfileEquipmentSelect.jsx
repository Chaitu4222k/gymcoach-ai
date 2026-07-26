import { Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";

import { AVAILABLE_EQUIPMENT } from "../../constants/profileConstants";

function ProfileEquipmentSelect({ control, errors }) {
  return (
    <Controller
      name="availableEquipment"
      control={control}
      render={({ field }) => {
        const value = Array.isArray(field.value) ? field.value : [];

        return (
          <FormControl fullWidth margin="normal" error={!!errors.availableEquipment}>
            <InputLabel id="available-equipment-label">
              Available Equipment
            </InputLabel>

            <Select
              labelId="available-equipment-label"
              multiple
              value={value}
              onChange={field.onChange}
              input={<OutlinedInput label="Available Equipment" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {selected.length
                    ? selected.map((item) => <Chip key={item} label={item} size="small" />)
                    : null}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 320,
                  },
                },
              }}
            >
              {AVAILABLE_EQUIPMENT.map((equipment) => (
                <MenuItem key={equipment} value={equipment}>
                  <Checkbox checked={value.includes(equipment)} />
                  <ListItemText primary={equipment} />
                </MenuItem>
              ))}
            </Select>

            {errors.availableEquipment?.message ? (
              <FormHelperText>{errors.availableEquipment.message}</FormHelperText>
            ) : null}
          </FormControl>
        );
      }}
    />
  );
}

export default ProfileEquipmentSelect;