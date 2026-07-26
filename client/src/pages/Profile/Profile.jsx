import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import AuthLayout from "../../components/layouts/AuthLayout";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileForm from "../../components/profile/ProfileForm";

import { useToast } from "../../hooks/useToast";

import {
  getCurrentUser,
  getProfile,
  createProfile,
  updateProfile,
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

function Profile() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_VALUES,
    mode: "onTouched",
  });

  const workoutLocation = watch("workoutLocation");

  const showEquipment = useMemo(() => {
    return workoutLocation === "Home" || workoutLocation === "Both";
  }, [workoutLocation]);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const userResponse = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(userResponse.data.data);

        try {
          const profileResponse = await getProfile();
          const profile = profileResponse.data;

          if (!isMounted) {
            return;
          }

          setIsProfileCreated(true);

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

          if (!isMounted) {
            return;
          }

          reset(EMPTY_VALUES);
          setIsProfileCreated(false);
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
  }, [reset, toast]);

  useEffect(() => {
    if (!showEquipment) {
      const currentEquipment = getValues("availableEquipment") || [];
      if (currentEquipment.length) {
        setValue("availableEquipment", [], { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [getValues, setValue, showEquipment]);

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
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthLayout title="Profile" subtitle="Loading your profile...">
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <ProfileHeader user={user} isProfileCreated={isProfileCreated} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ProfileForm
          control={control}
          register={register}
          errors={errors}
          loading={saving}
          isProfileCreated={isProfileCreated}
          showEquipment={showEquipment}
        />
      </form>
    </AuthLayout>
  );
}

export default Profile;