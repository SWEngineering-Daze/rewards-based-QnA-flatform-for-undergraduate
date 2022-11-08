import { Course, Department, Question } from '../database/mongodb.js';

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
    course: courseID,
  });

  res.json(question);
};

export const viewQuestionList = async (req, res) => {
  const { email } = req.decoded;
  const { type, name } = req.params;

  if (type == 'department') {
    const { id } = await Department.findOne({
      name,
    })
      .select('id')
      .exec();

    const questionList = (
      await Question.find()
        .populate({
          path: 'course',
          populate: {
            path: 'parent',
          },
        })
        .exec()
    ).filter((question) => {
      return question.course.parent.id == id;
    });

    console.log(questionList);
    res.json(questionList);
  } else if (type == 'course') {
    const { id } = await Course.findOne({
      name,
    })
      .select('id')
      .exec();

    console.log(id);

    const questionList = (
      await Question.find()
        .populate({
          path: 'course',
        })
        .exec()
    ).filter((question) => {
      return question.course._id == id;
    });

    console.log(questionList);
    res.json(questionList);
  }
};

export const viewQuestionDetail = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;

  const question = await Question.findOne({
    _id: id,
  }).exec();

  console.log(question);
};

export const writeAnswer = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;
  const { title, content } = req.body;
};
