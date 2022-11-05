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
  name: String,
});

const SignupTokenSchema = mongoose.Schema({
  value: String,
  email: String,
  password: String,
});

export const User = mongoose.model('users', UserSchema);
export const SignupToken = mongoose.model('signupTokens', SignupTokenSchema);
