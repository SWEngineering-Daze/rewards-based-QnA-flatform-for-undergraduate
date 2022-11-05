import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { User, SignupToken } from '../database/mongodb.js';
import nodeMailer from 'nodemailer';
import crypto from 'crypto';

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  const domain = email.split('@')[1];
  console.log(domain);

  if (domain != 'dgu.ac.kr' && domain != 'dongguk.edu') {
    res.status(400).json({ error: 'not a valid domain' });
  }

  const user = await User.findOne({ email }).exec();

  if (user) {
    res.status(400).json({ error: 'existing email address' });
  } else {
    const tokenValue = crypto.randomBytes(20).toString('hex');
    const encrypted = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

    SignupToken.create({
      value: tokenValue,
      email,
      password: encrypted,
      name,
    });

    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: config.SOTREE_EMAIL,
        pass: config.SOTREE_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: config.SOTREE_EMAIL,
      to: email,
      subject: '[대학생을 위한 리워드 기반 Q&A 플랫폼] 회원가입 승인 메일입니다.',
      html: '회원가입을 완료하기 위해 아래의 URL로 이동해주세요. <br>' + `https://sw.bisue.shop/verify/${tokenValue}`, // 프론트 URL
    });

    res.status(200).json({
      message: 'success',
    });
  }
};

export const verifyUser = async (req, res) => {
  const { signupToken } = req.body;

  const token = await SignupToken.findOne({ value: signupToken }).exec();
  await SignupToken.deleteOne({ value: token.value }).exec();

  const newUser = new User({ email: token.email, password: token.password });
  await newUser.save();

  res.status(200).json({ message: 'success' });
};
