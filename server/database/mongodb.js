import { ServerApiVersion } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import { config } from '../config.js';

const uri = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0.qq1ux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
  dbName: 'qnaPlatform',
});

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  point: Number,
  accumulatedExp: Number,
});

const SignupTokenSchema = mongoose.Schema({
  value: String,
  email: String,
  password: String,
});

const ResetTokenSchema = mongoose.Schema({
  value: String,
  email: String,
  createdAt: String,
  ttl: Number,
});

const departmentSchema = mongoose.Schema({
  parent: {
    id: Number,
    name: String,
  },
  name: String,
});

const courseSchema = mongoose.Schema({
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'departments',
  },
  name: String,
});

const questionSchema = mongoose.Schema(
  {
    writer: String,
    title: String,
    content: String,
    course: {
      type: Schema.Types.ObjectId,
      ref: 'courses',
    },
    fileIds: [Schema.Types.ObjectId],
    fileNames: [String],
  },
  {
    timestamps: true,
  }
);

const answerSchema = mongoose.Schema(
  {
    writer: String,
    content: String,
    question: {
      type: Schema.Types.ObjectId,
      ref: 'questions',
    },
    fileIds: [Schema.Types.ObjectId],
    fileNames: [String],
  },
  {
    timestamps: true,
  }
);

const todayPointSchema = mongoose.Schema(
  {
    value: Number,
  },
  {
    timestamps: true,
  }
);

const recommendationSchema = mongoose.Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    answer: {
      type: Schema.Types.ObjectId,
      ref: 'answers',
    },
  },
  {
    timestamps: true,
  }
);

const FileSchema = mongoose.Schema({
  fileName: String,
  originalName: String,
  postId: String,
});

const itemSchema = mongoose.Schema({
  name: String,
  url: String,
  price: Number,
});

const PartnerSchema = mongoose.Schema({
  name: String,
  url: String,
  items: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'items',
    },
  ],
});

const historySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
    },
    content: String,
    amount: Number,
  },
  {
    timestamps: true,
  }
);

const couponSchema = mongoose.Schema(
  {
    serialNumber: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
    },
    item: {
      type: mongoose.Types.ObjectId,
      ref: 'items',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('users', UserSchema);
export const SignupToken = mongoose.model('signupTokens', SignupTokenSchema);
export const ResetToken = mongoose.model('resetTokens', ResetTokenSchema);
export const Department = mongoose.model('departments', departmentSchema);
export const Course = mongoose.model('courses', courseSchema);
export const Question = mongoose.model('questions', questionSchema);
export const Answer = mongoose.model('answers', answerSchema);
export const TodayPoint = mongoose.model('todayPoints', todayPointSchema);
export const recommendation = mongoose.model('recommendations', recommendationSchema);
export const File = mongoose.model('files', FileSchema);
export const Item = mongoose.model('items', itemSchema);
export const History = mongoose.model('histories', historySchema);
export const Partner = mongoose.model('partners', PartnerSchema);
export const Coupon = mongoose.model('coupons', couponSchema);
