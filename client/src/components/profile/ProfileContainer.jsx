import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import ProfileModal from "./ProfileModal";

import { useToast } from "../../hooks/useToast";

import {
  getCurrentUser,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../../services/profileService";

const EMPTY_VALUES = {
  height: "",
  weight: "",
  fitnessGoal: "",
  experienceMonths: "",
  workoutLocation: "",
  workoutDaysPerWeek: "",
  workoutDuration: "",
  availableEquipment: [],
  dietPreference: "",
  averageSleepHours: "",
  activityLevel: "",
};

function ProfileContainer({ open, onClose }) {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [mode, setMode] = useState("create");

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, touchedFields },
    clearErrors,
  } = useForm({
    defaultValues: EMPTY_VALUES,
    mode: "onTouched",
  });

  const workoutLocation = watch("workoutLocation");

  const showEquipment = useMemo(
    () => workoutLocation === "Home" || workoutLocation === "Both",
    [workoutLocation]
  );

  const resetProfileState = useCallback(() => {
    reset(EMPTY_VALUES);
    clearErrors();
    setMode(isProfileCreated ? "view" : "create");
  }, [clearErrors, isProfileCreated, reset]);

  useEffect(() => {
    if (!open) {
      resetProfileState();
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setLoading(true);

      try {
        const userResponse = await getCurrentUser();

        if (!isMounted) return;

        setUser(userResponse.data.data);

        try {
          const profileResponse = await getProfile();
          const profile = profileResponse.data;

          if (!isMounted) return;

          setIsProfileCreated(true);
          setMode("view");

          reset({
            height: profile.height ?? "",
            weight: profile.weight ?? "",
            fitnessGoal: profile.fitnessGoal ?? "",
            experienceMonths: profile.experienceMonths ?? "",
            workoutLocation: profile.workoutLocation ?? "",
            workoutDaysPerWeek: profile.workoutDaysPerWeek ?? "",
            workoutDuration: profile.workoutDuration ?? "",
            availableEquipment: Array.isArray(profile.availableEquipment)
              ? profile.availableEquipment
              : [],
            dietPreference: profile.dietPreference ?? "",
            averageSleepHours: profile.averageSleepHours ?? "",
            activityLevel: profile.activityLevel ?? "",
          });
        } catch (error) {
          if (error.response?.status !== 404) {
            throw error;
          }

          if (!isMounted) return;

          setIsProfileCreated(false);
          setMode("create");
          reset(EMPTY_VALUES);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [open, reset, resetProfileState, toast]);

  useEffect(() => {
    if (!open) return;

    if (!showEquipment) {
      const currentEquipment = getValues("availableEquipment") || [];
      if (currentEquipment.length) {
        setValue("availableEquipment", [], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, [open, getValues, setValue, showEquipment]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const payload = {
        ...data,
        height: Number(data.height),
        weight: Number(data.weight),
        experienceMonths: Number(data.experienceMonths),
        workoutDaysPerWeek: Number(data.workoutDaysPerWeek),
        workoutDuration: Number(data.workoutDuration),
        averageSleepHours: Number(data.averageSleepHours),
        availableEquipment: showEquipment ? (data.availableEquipment || []) : [],
      };

      if (isProfileCreated) {
        await updateProfile(payload);
        toast.success("Profile updated successfully");
      } else {
        await createProfile(payload);
        setIsProfileCreated(true);
        toast.success("Profile created successfully");
      }

      setMode("view");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    resetProfileState();
    onClose?.();
  };

  const handleEdit = () => {
    setMode("edit");
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProfile();
      setIsProfileCreated(false);
      reset(EMPTY_VALUES);
      clearErrors();
      setMode("create");
      toast.success("Profile deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete profile");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProfileModal
      open={open}
      onClose={handleClose}
      mode={mode}
      profile={watch()}
      control={control}
      register={register}
      errors={errors}
      touchedFields={touchedFields}
      loading={loading || saving}
      deleting={deleting}
      showEquipment={showEquipment}
      onSubmit={handleSubmit(onSubmit)}
      onEdit={handleEdit}
      onDelete={handleDelete}
      user={user}
    />
  );
}

export default ProfileContainer;