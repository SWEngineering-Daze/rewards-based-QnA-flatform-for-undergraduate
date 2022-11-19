import { User } from '../database/mongodb.js';

export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).exec();
};

export const getUserWithoutPasswordByEmail = async (email) => {
  return await User.findOne({ email }).select('-password').exec();
};

export const updateUserPassword = async (email, encrypted) => {
  await User.updateOne({ email }, { password: encrypted }).exec();
};
