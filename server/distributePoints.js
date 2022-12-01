import mongoose from 'mongoose';
import { History, recommendation, TodayPoint, User } from './database/mongodb.js';
import dayjs from 'dayjs';
import { getUserByEmail } from './repository/userRepository.js';

const yesterday = dayjs().add(-1, 'day');
const yesterday_start = yesterday.startOf('day').toDate();
const yesterday_end = yesterday.endOf('day').toDate();
console.log(yesterday_start, yesterday_end);

const result = await recommendation.aggregate([
  {
    $match: {
      createdAt: {
        $gte: yesterday_start,
        $lt: yesterday_end,
      },
    },
  },
  {
    $lookup: {
      from: 'answers',
      localField: 'answer',
      foreignField: '_id',
      as: 'answer',
    },
  },
  {
    $unwind: {
      path: '$answer',
    },
  },
  {
    $group: {
      _id: '$answer.writer',
      count: {
        $sum: 1,
      },
    },
  },
]);

let total_recommendation = 0;

for (const user of result) {
  total_recommendation += user.count;
}

for (const user of result) {
  const userEmail = user._id;
  const num_recommendation = user.count;
  const exp_to_recomm_ratio = 5;

  const foundUser = await getUserByEmail(userEmail);
  const todayPoint = (await TodayPoint.find().sort({ createdAt: 1 }).exec())[0].value;

  const pointToGet = todayPoint * (num_recommendation / total_recommendation);
  await User.updateOne(
    {
      email: userEmail,
    },
    {
      $inc: {
        point: pointToGet,
        accumulatedExp: num_recommendation * exp_to_recomm_ratio,
      },
    }
  );

  await History.create({
    user: foundUser._id,
    content: '일일 정산',
    amount: pointToGet,
  });
}

mongoose.disconnect();
