import { Item, TodayPoint } from '../database/mongodb.js';

export const getPointsOfToday = async (req, res) => {
  const points = await TodayPoint.find().sort({ createdAt: 1 }).exec();
  res.json(points[0]);
};

export const getItems = async (req, res) => {
  const items = await Item.find().exec();
  res.json(items);
};
