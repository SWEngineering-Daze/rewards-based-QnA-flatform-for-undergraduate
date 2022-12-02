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

  if (user.point < item.price) {
    res.status(400).json({ message: 'User point is less than price' });
    return;
  }

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

  let coupons = await Coupon.aggregate()
    .match({ user: user._id })
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
    .sort({ createdAt: -1 })
    .exec();

  let partnerNames = [];

  for (const coupon of coupons) {
    const itemId = coupon.item._id;

    const partners = await Partner.find().exec();

    let partnerName;

    for (const partner of partners) {
      let found = false;

      for (const targetItemId of partner.items) {
        if (targetItemId.equals(itemId)) {
          partnerName = partner.name;
          found = true;

          break;
        }
      }

      if (found) {
        break;
      }
    }

    partnerNames.push(partnerName);
  }

  coupons = coupons.map((coupon, i) => {
    return {
      _id: coupon._id,
      serialNumber: coupon.serialNumber,
      user: coupon.user,
      item: coupon.item,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
      partnerName: partnerNames[i],
    };
  });

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

  const itemId = couponWithItem[0].item._id;

  const partners = await Partner.find().exec();

  let partnerName;

  for (const partner of partners) {
    let found = false;

    for (const targetItemId of partner.items) {
      if (targetItemId.equals(itemId)) {
        partnerName = partner.name;
        found = true;

        break;
      }
    }

    if (found) {
      break;
    }
  }

  const couponWithItemWithPartner = await Coupon.aggregate()
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
    .addFields({
      partnerName,
    })
    .exec();

  res.json(couponWithItemWithPartner);
};
