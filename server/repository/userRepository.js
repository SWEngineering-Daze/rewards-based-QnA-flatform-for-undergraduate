import { User } from '../database/mongodb.js';

export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).exec();
};
