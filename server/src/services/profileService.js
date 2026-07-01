const Profile = require("../models/Profile");

const createProfile = async (profileData) => {
  return await Profile.create(profileData);
};

const getProfileByUserId = async (userId) => {
  return await Profile.findOne({ userId });
};

const updateProfile = async (userId, profileData) => {
  return await Profile.findOneAndUpdate(
    { userId },
    profileData,
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteProfile = async (userId) => {
  return await Profile.findOneAndDelete({ userId });
};

module.exports = {
  createProfile,
  getProfileByUserId,
  updateProfile,
  deleteProfile,
};