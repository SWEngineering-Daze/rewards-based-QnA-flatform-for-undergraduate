import mongoose, { Schema } from 'mongoose';
import { Answer, Course, Question, recommendation, User } from '../database/mongodb.js';

export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).exec();
};

export const getAnswerById = async (id) => {
  const temp = await Answer.findOne({ _id: id }).exec();
  return await Answer.findOne({ _id: id }).exec();
};

export const addRecommendation = async (from, answer) => {
  await recommendation.create({
    from,
    answer,
  });
};

export const getQuestionsWithAll = async () => {
  return Question.aggregate()
    .lookup({
      from: 'answers',
      localField: '_id',
      foreignField: 'question',
      as: 'answers',
    })
    .lookup({
      from: 'courses',
      localField: 'course',
      foreignField: '_id',
      as: 'course',
    })
    .unwind({
      path: '$course',
      preserveNullAndEmptyArrays: true,
    })
    .lookup({
      from: 'departments',
      localField: 'course.parent',
      foreignField: '_id',
      as: 'course.parent',
    })
    .unwind({ path: '$course.parent', preserveNullAndEmptyArrays: true })
    .sort({ createdAt: -1 })
    .exec();
};

export const getAnswersWithAll = async () => {
  return await Answer.aggregate()
    .lookup({
      from: 'recommendations',
      localField: '_id',
      foreignField: 'answer',
      as: 'recommendation',
    })
    .lookup({
      from: 'questions',
      localField: 'question',
      foreignField: '_id',
      as: 'question',
    })
    .unwind({
      path: '$question',
      preserveNullAndEmptyArrays: true,
    })
    .lookup({
      from: 'courses',
      localField: 'question.course',
      foreignField: '_id',
      as: 'question.course',
    })
    .unwind({
      path: '$question.course',
      preserveNullAndEmptyArrays: true,
    })
    .lookup({
      from: 'departments',
      localField: 'question.course.parent',
      foreignField: '_id',
      as: 'question.course.parent',
    })
    .unwind({
      path: '$question.course.parent',
      preserveNullAndEmptyArrays: true,
    })
    .exec();
};

export const getAnswersWithQuestion = async () => {
  return await Answer.find().populate('question').exec();
};

export const addAnswer = async (email, content, id) => {
  return await Answer.create({
    writer: email,
    content,
    question: id,
  });
};

export const getQuestionDetailById = async (id) => {
  return {
    question: (
      await Question.aggregate()
        .match({
          _id: mongoose.Types.ObjectId(id),
        })
        .unwind()
        .lookup({
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course',
        })
        .unwind({
          path: '$course',
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: 'departments',
          localField: 'course.parent',
          foreignField: '_id',
          as: 'parent',
        })
        .unwind({
          path: '$course.parent',
          preserveNullAndEmptyArrays: true,
        })
        .exec()
    )[0],
    answers: await Answer.aggregate()
      .match({
        question: mongoose.Types.ObjectId(id),
      })
      .lookup({
        from: 'recommendations',
        localField: '_id',
        foreignField: 'answer',
        as: 'recommendation',
      })
      .sort({ createdAt: 1 })
      .exec(),
  };
};

export const getCourseByName = async (courseName) => {
  return await Course.findOne({
    name: courseName,
  }).exec();
};

export const addQuestion = async (email, title, content, courseID) => {
  return await Question.create({
    writer: email,
    title,
    content,
    course: courseID,
  });
};
