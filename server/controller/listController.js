import { Course, Department } from '../database/mongodb.js';

export const getDepartments = async (req, res) => {
  const departments = await Department.find()
    .sort({
      'parent.id': 1,
    })
    .exec();

  res.json(departments);
};

export const getCourses = async (req, res) => {
  const courses_with_depts = await Course.find().populate('parent').exec();

  res.json(courses_with_depts);
};
