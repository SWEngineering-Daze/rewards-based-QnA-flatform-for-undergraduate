import { Course, Question } from '../database/mongodb.js';

export const writeQuestion = async (req, res) => {
  const { email } = req.decoded;
  const { title, content, courseName } = req.body;

  const course = await Course.findOne({
    name: courseName,
  }).exec();

  const courseID = course._id;

  console.log(course._id);

  const question = await Question.create({
    writer: email,
    title,
    content,
    courseID: courseID,
  });

  res.json(question);
};

export const viewQuestionList = async (req, res) => {
  const { email } = req.decoded;
  const { type, id } = req.params;

  if (type == 'department') {
    const questionList = (
      await Question.find()
        .populate({
          path: 'courseID',
          populate: {
            path: 'parent',
          },
        })
        .exec()
    ).filter((question) => {
      return question.courseID.parent.parent.id == Number.parseInt(id);
    });

    console.log(questionList);
    res.json(questionList);
  } else if (type == 'course') {
  }

  console.log(type, id);
};
