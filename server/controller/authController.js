import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { User, SignupToken } from '../database/mongodb.js';
import nodeMailer from 'nodemailer';
import crypto from 'crypto';

export const signup = async (req, res) => {
  const { email, password } = req.body;

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
      subject: '[대학생을 위한 리워드 기반 Q&A 플랫폼] 회원가입 승인 이메일입니다.',
      html:
        '회원가입을 완료하기 위해 아래의 URL로 이동해주세요. <br>' +
        `http://sw.bisue.shop/auth/veifry?token=${tokenValue}`, // 프론트 URL
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).exec();

  if (!user) {
    res.status(400).json({ error: 'wrong email address' });
  } else {
    const found = await bcrypt.compare(password, user.password);

    if (found) {
      const token = jwt.sign(
        {
          type: 'JWT',
          email: user.email,
          createdAt: new Date(),
        },
        config.JWT_SECRET_KEY,
        {
          expiresIn: '1440m',
        }
      );

      const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

      res.status(200).json({ token, email: decoded.email });
    } else {
      res.status(400).json({ error: 'wrong password' });
    }
  }
};

export const me = async (req, res) => {
  const { email } = req.decoded;
  const user = await User.findOne({ email }).select('-password').exec();
  res.status(200).json(user);
};
