import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import dayjs from 'dayjs';
import { Answer, File, Question } from '../database/mongodb.js';
import { addAnswer, getAnswerById, getAnswersWithAll, getAnswersWithQuestion } from '../repository/answerRepository.js';
import { getCourseByName } from '../repository/courseRepository.js';
import { addQuestion, getQuestionDetailById, getQuestionsWithAll } from '../repository/questionRepository.js';
import { addRecommendation } from '../repository/recommendationRepository.js';
import { getUserByEmail } from '../repository/userRepository.js';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
    file.originalname = filename;

    if (!fs.existsSync('./uploadedFiles')) {
      fs.mkdirSync('./uploadedFiles');
    }
    callback(null, './uploadedFiles');
  },
});

const upload = multer({ storage });

export const uploadFiles = upload.array('attachment');

export const writeQuestion = async (req, res) => {
  const { email } = req.decoded;
  const { information } = req.body;
  const parsedInformation = JSON.parse(information);
  const { title, content, courseName } = parsedInformation;

  const course = await getCourseByName(courseName);
  const courseID = course._id;

  console.log(course._id);
  console.log(title, content);
  console.log(req.files);

  let fileNames = [];

  for (const targetFile of req.files) {
    fileNames.push(targetFile.originalname);
  }

  let question = await addQuestion(email, title, content, courseID, [], fileNames);

  for (const targetFile of req.files) {
    const splited = targetFile.originalname.split('.');
    const extension = splited[splited.length - 1];

    const file = await File.create({
      fileName: `${targetFile.filename}.${extension}`,
      originalName: targetFile.originalname,
      postId: question._id,
    });

    await Question.updateOne({ _id: question._id }, { $push: { fileIds: mongoose.Types.ObjectId(file._id) } });

    question = await Question.findById(question._id);

    fs.rename(
      `./uploadedFiles/${targetFile.filename}`,
      `./uploadedFiles/${targetFile.filename}.${extension}`,
      () => {}
    );
  }

  res.json(question);
};

export const viewQuestionList = async (req, res) => {
  const page = parseInt(req.query.page); // 1페이지부터 시작
  const query = req.query.query;
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

    if (query) {
      queryBuilder = queryBuilder.match({
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
  const { information } = req.body;
  console.log(id);
  console.log(information);
  const parsedInformation = JSON.parse(information);
  const { content } = parsedInformation;
  console.log(req.files);

  let fileNames = [];

  for (const targetFile of req.files) {
    fileNames.push(targetFile.originalname);
  }

  let answer = await addAnswer(email, content, id, [], fileNames);

  for (const targetFile of req.files) {
    const splited = targetFile.originalname.split('.');
    const extension = splited[splited.length - 1];

    const file = await File.create({
      fileName: `${targetFile.filename}.${extension}`,
      originalName: targetFile.originalname,
      postId: answer._id,
    });

    console.log(typeof file._id);

    await Answer.updateOne({ _id: answer._id }, { $push: { fileIds: file._id } });

    answer = await Answer.findById(answer._id);

    fs.rename(
      `./uploadedFiles/${targetFile.filename}`,
      `./uploadedFiles/${targetFile.filename}.${extension}`,
      () => {}
    );
  }

  res.json(answer);
};

export const viewMyQuestions = async (req, res) => {
  const { email } = req.decoded;
  const page = parseInt(req.query.page);
  const perPage = parseInt(req.query.perPage);
  const query = req.query.query;

  let questionList;
  let cntQuestions;
  let cntAnswers = [];

  questionList = (await getQuestionsWithAll(query))
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

  let cntAnswer = [];

  for (const answer of answerList) {
    const question = answer.question;
    const questionId = question._id;
    const answers = await Answer.find({ question: questionId }).exec();
    cntAnswer.push(answers.length);
  }

  answerList = answerList.map((answer, index) => {
    let obj = {
      _id: answer._id,
      writer: answer.writer,
      title: answer.title,
      content: answer.content,
      question: answer.question,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
      recommendation: answer.recommendation,
    };

    obj.question.countAnswer = cntAnswer[index];

    return obj;
  });

  res.json({
    answerList,
    cntAnswers,
  });
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

export const deleteAnswer = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;

  const answer = await Answer.findOne({
    _id: id,
    writer: email,
  });

  if (answer) {
    const { fileIds } = answer;

    for (const fileId of fileIds) {
      const { fileName } = await File.findById(fileId);
      console.log(fileName);

      if (fs.existsSync(`./uploadedFiles/${fileName}`)) {
        fs.rmSync(`./uploadedFiles/${fileName}`);
      }

      await File.deleteOne({ _id: fileId });
    }
    await Answer.deleteOne({ _id: id });

    res.json({ message: 'success' });
  } else {
    res.status(400).json({ message: 'Invalid writer or the answer does not exist' });
  }
};

export const updateAnswser = async (req, res) => {
  const { id } = req.params;
  const { information } = req.body;
  const parsedInformation = JSON.parse(information);
  let { content, filesToDelete } = parsedInformation;

  let originalNames = [];
  for (const fileId of filesToDelete) {
    console.log(fileId);
    const { fileName, originalName } = await File.findById(mongoose.Types.ObjectId(fileId));
    console.log(fileName, originalName);

    originalNames.push(originalName);

    if (fs.existsSync(`./uploadedFiles/${fileName}`)) {
      fs.rmSync(`./uploadedFiles/${fileName}`);
    }

    await File.deleteOne({ _id: mongoose.Types.ObjectId(fileId) });
  }

  filesToDelete = filesToDelete.map((fileIds) => mongoose.Types.ObjectId(fileIds));

  let fileNames = [];

  for (const targetFile of req.files) {
    fileNames.push(targetFile.originalname);
  }

  await Answer.updateOne({ _id: id }, { $push: { fileNames: { $each: fileNames } } });

  for (const targetFile of req.files) {
    const splited = targetFile.originalname.split('.');
    const extension = splited[splited.length - 1];

    const file = await File.create({
      fileName: `${targetFile.filename}.${extension}`,
      originalName: targetFile.originalname,
      postId: id,
    });

    await Answer.updateOne({ _id: id }, { $push: { fileIds: mongoose.Types.ObjectId(file._id) } });

    fs.rename(
      `./uploadedFiles/${targetFile.filename}`,
      `./uploadedFiles/${targetFile.filename}.${extension}`,
      () => {}
    );
  }

  await Answer.updateOne(
    { _id: mongoose.Types.ObjectId(id) },
    {
      content,
      $pull: {
        fileIds: {
          $in: filesToDelete,
        },
        fileNames: {
          $in: originalNames,
        },
      },
    }
  ).exec();

  res.json({ message: 'success' });
};

export const deleteQuestion = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;

  const questionWithAnswers = (
    await Question.aggregate()
      .match({ _id: mongoose.Types.ObjectId(id) })
      .lookup({
        from: 'answers',
        as: 'answers',
        localField: '_id',
        foreignField: 'question',
      })
      .exec()
  )[0];

  const answers = questionWithAnswers.answers;

  let questionToDelete = questionWithAnswers._id;
  let answersToDelete = [];
  let fileIdsToDelete = [];

  for (const fileId of questionWithAnswers.fileIds) {
    fileIdsToDelete.push(fileId);
  }

  for (const answer of answers) {
    answersToDelete.push(answer._id);
    fileIdsToDelete = [...fileIdsToDelete, ...answer.fileIds];
  }

  let filesToDelete = [];
  if (fileIdsToDelete.length != 0) {
    filesToDelete = (
      await File.find({
        $or: fileIdsToDelete.map((fileId) => {
          return {
            _id: fileId,
          };
        }),
      })
        .select('fileName')
        .exec()
    ).map((file) => file.fileName);
  }

  await Question.deleteOne({ _id: questionToDelete }).exec();
  await Answer.deleteMany({
    _id: {
      $in: answersToDelete,
    },
  }).exec();
  await File.deleteMany({
    _id: {
      $in: fileIdsToDelete,
    },
  });

  for (const fileName of filesToDelete) {
    if (fs.existsSync(`./uploadedFiles/${fileName}`)) {
      fs.rmSync(`./uploadedFiles/${fileName}`);
    }
  }

  res.json({
    questionToDelete,
    answersToDelete,
    fileIdsToDelete,
    filesToDelete,
  });
};

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { information } = req.body;
  const parsedInformation = JSON.parse(information);
  let { title, content, filesToDelete } = parsedInformation;

  let originalNames = [];

  for (const fileId of filesToDelete) {
    console.log(fileId);
    const { fileName, originalName } = await File.findById(mongoose.Types.ObjectId(fileId));
    console.log(fileName, originalName);

    originalNames.push(originalName);

    if (fs.existsSync(`./uploadedFiles/${fileName}`)) {
      fs.rmSync(`./uploadedFiles/${fileName}`);
    }

    await File.deleteOne({ _id: mongoose.Types.ObjectId(fileId) });
  }

  filesToDelete = filesToDelete.map((fileIds) => mongoose.Types.ObjectId(fileIds));

  let fileNames = [];

  for (const targetFile of req.files) {
    fileNames.push(targetFile.originalname);
  }

  await Question.updateOne({ _id: id }, { $push: { fileNames: { $each: fileNames } } });

  for (const targetFile of req.files) {
    const splited = targetFile.originalname.split('.');
    const extension = splited[splited.length - 1];

    const file = await File.create({
      fileName: `${targetFile.filename}.${extension}`,
      originalName: targetFile.originalname,
      postId: id,
    });

    await Question.updateOne({ _id: id }, { $push: { fileIds: mongoose.Types.ObjectId(file._id) } });

    fs.rename(
      `./uploadedFiles/${targetFile.filename}`,
      `./uploadedFiles/${targetFile.filename}.${extension}`,
      () => {}
    );
  }

  await Question.updateOne(
    { _id: mongoose.Types.ObjectId(id) },
    {
      title,
      content,
      $pull: {
        fileIds: {
          $in: filesToDelete,
        },
        fileNames: {
          $in: originalNames,
        },
      },
    }
  ).exec();

  res.json({ message: 'success' });
};

export const getBestQuestions = async (req, res) => {};

export const getNewQuestions = async (req, res) => {
  const questions = await Question.aggregate()
    .sort({ createdAt: -1 })
    .limit(5)
    .lookup({
      from: 'courses',
      as: 'course',
      localField: 'course',
      foreignField: '_id',
    })
    .lookup({
      from: 'departments',
      as: 'course.parent',
      localField: 'course.parent',
      foreignField: '_id',
    })
    .exec();

  res.json(questions);
};

export const getOldQuestions = async (req, res) => {
  const dayBeforeYesterday = dayjs().add(-2, 'day');
  const dayBeforeYesterday_start = dayBeforeYesterday.startOf('day').toDate();

  console.log(dayBeforeYesterday_start);

  const questions = await Question.aggregate()
    .lookup({
      from: 'answers',
      as: 'answers',
      localField: '_id',
      foreignField: 'question',
    })
    .match({
      createdAt: {
        $gte: dayBeforeYesterday_start,
      },
      answers: [],
    })
    .sort({ createdAt: 1 })
    .limit(5)
    .lookup({
      from: 'courses',
      as: 'course',
      localField: 'course',
      foreignField: '_id',
    })
    .lookup({
      from: 'departments',
      as: 'course.parent',
      localField: 'course.parent',
      foreignField: '_id',
    })
    .exec();

  res.json(questions);
};
