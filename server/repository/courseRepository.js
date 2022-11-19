import { Course } from '../database/mongodb.js';

export const getCourseByName = async (courseName) => {
  return await Course.findOne({
    name: courseName,
  }).exec();
};
