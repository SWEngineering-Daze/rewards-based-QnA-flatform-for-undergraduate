import { Coupon, History, Item, Partner, TodayPoint, User } from '../database/mongodb.js';
import { getUserByEmail } from '../repository/userRepository.js';
import crypto from 'crypto';
import mongoose from 'mongoose';

export const getPointsOfToday = async (req, res) => {
  const points = await TodayPoint.find().sort({ createdAt: 1 }).exec();
  res.json(points[0]);
};

export const getItems = async (req, res) => {
  const items = await Partner.aggregate()
    .lookup({
      from: 'items',
      localField: 'items',
      foreignField: '_id',
      as: 'items',
    })
    .exec();

  res.json(items);
};

export const exchangeItem = async (req, res) => {
  const { email } = req.decoded;
  const { id } = req.params;

  const user = await getUserByEmail(email);
  const item = await Item.findById(id).exec();

  const partners = await Partner.find().exec();

  let partnerName = '';

  for (const partner of partners) {
    let found = false;

    for (const targetItemId of partner.items) {
      console.log(targetItemId, item._id);

      if (targetItemId.equals(item._id)) {
        partnerName = partner.name;
        found = true;

        break;
      }
    }

    if (found) {
      break;
    }
  }

  const { price } = item;

  await User.updateOne(
    {
      email,
    },
    {
      $inc: { point: -price },
    }
  ).exec();

  const couponSerialNumber = (() => {
    let str = '';

    for (let i = 0; i < 4; i++) {
      str += crypto.randomBytes(2).toString('hex');
      str += '-';
    }
    str = str.substring(0, str.length - 1);
    return str;
  })();

  const coupon = new Coupon({
    serialNumber: couponSerialNumber,
    user: user._id,
    item: item._id,
  });

  await coupon.save();

  await History.create({
    user: user._id,
    content: `상품 구매(${partnerName} - ${item.name})`,
    amount: -item.price,
  });

  res.json(coupon);
};

export const getHistories = async (req, res) => {
  const { email } = req.decoded;
  const user = await getUserByEmail(email);

  const histories = await History.find({ user: user._id }).sort({ createdAt: -1 }).exec();

  res.json(histories);
};

export const getCoupons = async (req, res) => {
  const { email } = req.decoded;
  const user = await getUserByEmail(email);

  const coupons = await Coupon.find({ user: user._id }).sort({ createdAt: -1 }).exec();

  res.json(coupons);
};

export const getCouponDetail = async (req, res) => {
  const { id } = req.params;

  const couponWithItem = await Coupon.aggregate()
    .match({ _id: mongoose.Types.ObjectId(id) })
    .lookup({
      from: 'items',
      as: 'item',
      localField: 'item',
      foreignField: '_id',
    })
    .unwind({
      path: '$item',
      preserveNullAndEmptyArrays: true,
    })
    .exec();

  res.json(couponWithItem);
};
