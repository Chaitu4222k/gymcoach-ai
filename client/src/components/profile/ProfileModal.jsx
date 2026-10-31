import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import AppModal from "../modal/AppModal";

import ProfileForm from "./ProfileForm";
import ProfileView from "./ProfileView";

function ProfileModal({
  open,
  onClose,
  mode,
  profile,
  control,
  register,
  errors,
  touchedFields,
  loading,
  deleting,
  showEquipment,
  onSubmit,
  onEdit,
  onDelete,
  user,
}) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const isView = mode === "view";
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isFormMode = isCreate || isEdit;

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete();
    }
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <AppModal
        open={open}
        onClose={onClose}
        maxWidth="lg"
        disableEnforceFocus={confirmDeleteOpen}
        title={isCreate ? "Complete Profile" : "My Profile"}
        subtitle={
          isCreate
            ? "Complete your profile to generate personalised AI workouts."
            : "Manage your fitness profile."
        }
        showFooter={!isView}
        headerActions={
          isView ? (
            <Stack direction="row" spacing={1}>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={loading || deleting}
              >
                Delete
              </Button>
              <Button
                startIcon={<EditIcon />}
                onClick={onEdit}
                disabled={loading || deleting}
              >
                Edit
              </Button>
            </Stack>
          ) : null
        }
        footer={
          <>
            <Button onClick={onClose} disabled={loading || deleting}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={loading || deleting}
            >
              {isCreate ? "Create Profile" : "Save Changes"}
            </Button>
          </>
        }
      >
        {!isFormMode ? (
          <ProfileView profile={profile} user={user} />
        ) : (
          <ProfileForm
            control={control}
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            loading={loading}
            isProfileCreated={!isCreate}
            showEquipment={showEquipment}
            onSubmit={onSubmit}
          />
        )}
      </AppModal>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => !deleting && setConfirmDeleteOpen(false)}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              p: 3,
              borderRadius: 3,
              maxWidth: 420,
              bgcolor: "background.paper",
            },
          },
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1}>
          Delete Fitness Profile?
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          This action cannot be undone. All your saved profile metrics and preferences will be permanently removed.
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </Stack>
      </Dialog>
    </>
  );
}

export default ProfileModal;