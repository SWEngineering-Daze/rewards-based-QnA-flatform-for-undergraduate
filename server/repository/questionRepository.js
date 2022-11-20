import mongoose from 'mongoose';
import { Answer, Question } from '../database/mongodb.js';

export const getQuestionsWithAll = async (query) => {
  let result = Question.aggregate();

  if (query) {
    result = result.match({
      $or: [
        {
          title: { $regex: query },
        },
        {
          content: { $regex: query },
        },
      ],
    });
  }

  return result
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
          as: 'course.parent',
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
        as: 'recommendations',
      })
      .sort({ createdAt: 1 })
      .exec(),
  };
};

export const addQuestion = async (email, title, content, courseID, fileIds, fileNames) => {
  return await Question.create({
    writer: email,
    title,
    content,
    course: courseID,
    fileIds,
    fileNames,
  });
};
