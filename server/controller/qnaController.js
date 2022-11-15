import { ObjectId } from 'mongodb';
import { Answer, Course, Department, Question, User } from '../database/mongodb.js';

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
  const { type, name: encodedUrl } = req.params;
  const name = encodedUrl.replaceAll('!', '/');

  let questionList;
  let cntQuestions;
  let cntAnswers = [];

  if (type == 'department') {
    const { id } = await Department.findOne({
      name,
    })
      .select('id')
      .exec();

    questionList = (
      await Question.find().populate({
        path: 'course',
        populate: {
          path: 'parent',
        },
      })
    )
      .filter((question) => question.course.parent._id == id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    cntQuestions = questionList.length;
    questionList = questionList.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

    const answers = await Answer.find().populate('question').exec();

    for (const question of questionList) {
      const questionID = question._id;
      let cntAnswer = 0;

      for (const answer of answers) {
        if (answer.question != null) {
          if (answer.question._id.equals(questionID)) {
            cntAnswer++;
          }
        }
      }
      cntAnswers.push(cntAnswer);
    }

    questionList = questionList.map((question, index) => {
      return {
        _id: question._id,
        writer: question.writer,
        title: question.title,
        content: question.content,
        course: question.course,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        countAnswer: cntAnswers[index],
      };
    });
  } else if (type == 'course') {
    const { id } = await Course.findOne({
      name,
    })
      .select('id')
      .exec();

    console.log(id);

    questionList = (await Question.find().populate('course').exec())
      .filter((question) => question.course._id == id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    cntQuestions = questionList.length;
    questionList = questionList.slice((page - 1) * perPage, (page - 1) * perPage + perPage);
  }

  const answers = await Answer.find().populate('question').exec();

  for (const question of questionList) {
    const questionID = question._id;
    let cntAnswer = 0;

    for (const answer of answers) {
      if (answer.question != null) {
        if (answer.question._id.equals(questionID)) {
          cntAnswer++;
        }
      }
    }
    cntAnswers.push(cntAnswer);
  }

  questionList = questionList.map((question, index) => {
    return {
      _id: question._id,
      writer: question.writer,
      title: question.title,
      content: question.content,
      course: question.course,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      countAnswer: cntAnswers[index],
    };
  });

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

export const recommendAnswer = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;

  const userID = await User.findOne({ email }).select('_id').exec();

  const answerWriter = (await Answer.findOne({ _id: id }).select('writer').exec()).writer;

  console.log(email);
  console.log(answerWriter);

  if (answerWriter == email) {
    res.status(400).json({
      message: 'not a valid user',
    });

    return;
  }

  if (answerWriter)
    await Answer.updateOne(
      {
        _id: id,
      },
      {
        $push: {
          recommendedBy: userID,
        },
      }
    ).exec();

  res.json({
    message: 'success',
  });
};

export const viewMyQuestions = async (req, res) => {
  const { email } = req.decoded;
  const page = parseInt(req.query.page);
  const perPage = parseInt(req.query.perPage);

  let questionList;
  let cntQuestions;
  let cntAnswers = [];

  questionList = (
    await Question.find().populate({
      path: 'course',
      populate: {
        path: 'parent',
      },
    })
  )
    .filter((question) => question.writer == email)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  cntQuestions = questionList.length;
  questionList = questionList.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  const answers = await Answer.find().populate('question').exec();

  for (const question of questionList) {
    const questionID = question._id;
    let cntAnswer = 0;

    for (const answer of answers) {
      if (answer.question != null) {
        if (answer.question._id.equals(questionID)) {
          cntAnswer++;
        }
      }
    }
    cntAnswers.push(cntAnswer);
  }

  questionList = questionList.map((question, index) => {
    return {
      _id: question._id,
      writer: question.writer,
      title: question.title,
      content: question.content,
      course: question.course,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      countAnswer: cntAnswers[index],
    };
  });

  res.json({
    questionList,
    cntQuestions,
  });
};

export const viewMyAnswers = async (req, res) => {
  const { email } = req.decoded;
  const page = parseInt(req.query.page);
  const perPage = parseInt(req.query.perPage);

  let answerList;
  let cntAnswers;

  answerList = (
    await Answer.find().populate({
      path: 'question',
      populate: {
        path: 'course',
        populate: {
          path: 'parent',
        },
      },
    })
  )
    .filter((answer) => answer.writer == email)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  cntAnswers = answerList.length;
  answerList = answerList.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  answerList = answerList.map((answer, index) => {
    return {
      _id: answer._id,
      writer: answer.writer,
      title: answer.title,
      content: answer.content,
      question: answer.question,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    };
  });

  res.json({
    answerList,
    cntAnswers,
  });
};
