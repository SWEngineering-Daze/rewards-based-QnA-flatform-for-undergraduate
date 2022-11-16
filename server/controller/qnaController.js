import { ObjectId } from 'mongodb';
import { Answer, Course, Department, Question, User } from '../database/mongodb.js';
import {
  addAnswer,
  addQuestion,
  addRecommendation,
  getAnswerById,
  getAnswersWithAll,
  getAnswersWithQuestion,
  getCourseByName,
  getQuestionDetailById,
  getQuestionsWithAll,
  getUserByEmail,
} from '../repository/repository.js';

export const writeQuestion = async (req, res) => {
  const { email } = req.decoded;
  const { title, content, courseName } = req.body;

  const course = await getCourseByName(courseName);
  const courseID = course._id;

  console.log(course._id);

  const question = await addQuestion(title, content, courseName, courseID);

  res.json(question);
};

export const viewQuestionList = async (req, res) => {
  const page = parseInt(req.query.page); // 1페이지부터 시작
  const perPage = 10;

  const { type, name: encodedUrl } = req.params;
  const name = encodedUrl.replaceAll('!', '/');

  const fetchQuestionPaginator = async (type, name) => {
    let queryBuilder = Question.aggregate([])
      .lookup({
        // 과목 join (1:1 - unwind)
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      })
      .unwind({ path: '$course', preserveNullAndEmptyArrays: true })
      .lookup({
        // 과목.학과 join (1:1 - unwind)
        from: 'departments',
        localField: 'course.parent',
        foreignField: '_id',
        as: 'course.parent',
      })
      .unwind({ path: '$course.parent', preserveNullAndEmptyArrays: true })
      .sort({ createdAt: -1 }); // sort latest

    // 학과 or 과목 match
    if (type === 'department') {
      queryBuilder = queryBuilder.match({ 'course.parent.name': name });
    } else {
      queryBuilder = queryBuilder.match({ 'course.name': name });
    }

    return (
      queryBuilder
        // 답변 join (1:N)
        .lookup({
          from: 'answers',
          localField: '_id',
          foreignField: 'question',
          as: 'answers',
        })
        // 분기
        .facet({
          questionList: [{ $skip: (page - 1) * perPage }, { $limit: perPage }],
          total: [{ $count: 'total' }],
        })
        .unwind({ path: '$total', preserveNullAndEmptyArrays: true })
        .exec()
        // aggregate 반환값이 배열이라 결과 mapping
        .then((r) => r[0])
    );
  };

  const paginator = await fetchQuestionPaginator(type, name);

  res.json({
    questionList: paginator.questionList,
    cntQuestions: paginator.total?.total ?? 0,
  });
};

export const viewQuestionDetail = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;

  const { question, answers } = await getQuestionDetailById(id);

  res.json({
    question,
    answers,
  });
};

export const writeAnswer = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;
  const { content } = req.body;

  const answer = await addAnswer(email, content, id);

  res.json(answer);
};

export const recommendAnswer = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;

  const userID = (await getUserByEmail(email)).id;
  const answerWriter = (await getAnswerById(id)).writer;

  console.log(email);
  console.log(answerWriter);

  if (answerWriter == email) {
    res.status(400).json({
      message: 'not a valid user',
    });
    return;
  }

  await addRecommendation(userID, id);

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

  questionList = (await getQuestionsWithAll())
    .filter((question) => question.writer == email)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  cntQuestions = questionList.length;
  questionList = questionList.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  const answers = await getAnswersWithQuestion();

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

  answerList = (await getAnswersWithAll())
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
      recommendation: answer.recommendation,
    };
  });

  res.json({
    answerList,
    cntAnswers,
  });
};
