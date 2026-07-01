const { validationResult } = require("express-validator");

const {
  createProfile,
  getProfileByUserId,
  updateProfile,
  deleteProfile,
} = require("../services/profileService");

const createProfileController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const existingProfile = await getProfileByUserId(req.user.id);

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    const profile = await createProfile({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateProfileController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const profile = await updateProfile(
      req.user.id,
      req.body
    );

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteProfileController = async (req, res) => {
  try {
    const profile = await deleteProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
      message: "Profile deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createProfile: createProfileController,
  getProfile,
  updateProfile: updateProfileController,
  deleteProfile: deleteProfileController,
};