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
    recommendedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
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

export const User = mongoose.model('users', UserSchema);
export const SignupToken = mongoose.model('signupTokens', SignupTokenSchema);
export const ResetToken = mongoose.model('resetTokens', ResetTokenSchema);
export const Department = mongoose.model('departments', departmentSchema);
export const Course = mongoose.model('courses', courseSchema);
export const Question = mongoose.model('questions', questionSchema);
export const Answer = mongoose.model('answers', answerSchema);
export const TodayPoint = mongoose.model('todayPoints', todayPointSchema);
