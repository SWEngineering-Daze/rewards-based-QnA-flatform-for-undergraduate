import { Answer, Course, Department, Question } from '../database/mongodb.js';

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
  const page = parseInt(req.query.page); // 1페이지부터 시작
  const perPage = 10;

  const { email } = req.decoded;
  const { type, name } = req.params;

  let questionList;
  let cntQuestions;

  if (type == 'department') {
    const { id } = await Department.findOne({
      name,
    })
      .select('id')
      .exec();

    questionList = (
      await Question.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
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

    cntQuestions = (
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
    }).length;
  } else if (type == 'course') {
    const { id } = await Course.findOne({
      name,
    })
      .select('id')
      .exec();

    console.log(id);

    questionList = (
      await Question.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate({
          path: 'course',
        })
        .exec()
    ).filter((question) => {
      return question.course._id == id;
    });

    cntQuestions = (
      await Question.find()
        .populate({
          path: 'course',
        })
        .exec()
    ).filter((question) => {
      return question.course._id == id;
    }).length;
  }

  res.json({
    questionList,
    cntQuestions,
  });
};

export const viewQuestionDetail = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;

  const question = await Question.findOne({
    _id: id,
  })
    .populate({
      path: 'course',
      populate: {
        path: 'parent',
      },
    })
    .exec();

  const answers = await Answer.find({
    question: question._id,
  }).sort({ createdAt: 1 });

  res.json({
    question,
    answers,
  });
};

export const writeAnswer = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;
  const { content } = req.body;

  const answer = await Answer.create({
    writer: email,
    content,
    question: id,
  });

  res.json(answer);
};
