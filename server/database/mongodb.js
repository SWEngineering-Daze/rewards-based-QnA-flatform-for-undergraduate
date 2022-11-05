import { ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
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

const departmentSchema = mongoose.Schema({
  parent: {
    id: Number,
    name: String,
  },
  name: String,
});

export const User = mongoose.model('users', UserSchema);
export const SignupToken = mongoose.model('signupTokens', SignupTokenSchema);
export const Department = mongoose.model('departments', departmentSchema);
