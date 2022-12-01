import { Item, TodayPoint } from '../database/mongodb.js';
import { getUserByEmail } from '../repository/userRepository.js';

export const getPointsOfToday = async (req, res) => {
  const points = await TodayPoint.find().sort({ createdAt: 1 }).exec();
  res.json(points[0]);
};

export const getItems = async (req, res) => {
  const items = await Item.find().exec();
  res.json(items);
};

export const exchangeItem = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;

  const item = await Item.findById(id).exec();
  const user = await getUserByEmail(email);

  // to do
  const { price } = item;
};
