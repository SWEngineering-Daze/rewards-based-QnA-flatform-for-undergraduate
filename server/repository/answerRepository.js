import { Answer } from '../database/mongodb.js';

export const getAnswerById = async (id) => {
  return await Answer.findOne({ _id: id }).exec();
};

export const getAnswersWithAll = async () => {
  return await Answer.aggregate()
    .lookup({
      from: 'recommendations',
      localField: '_id',
      foreignField: 'answer',
      as: 'recommendations',
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

export const addAnswer = async (email, content, id, fileIds, fileNames) => {
  return await Answer.create({
    writer: email,
    content,
    question: id,
    fileIds,
    fileNames,
  });
};
