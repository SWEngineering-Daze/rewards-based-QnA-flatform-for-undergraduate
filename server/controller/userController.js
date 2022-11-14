import bcrypt from 'bcrypt';
import nodeMailer from 'nodemailer';
import crypto from 'crypto';
import { config } from '../config.js';
import { ResetToken, User } from '../database/mongodb.js';

export const changePassword = async (req, res) => {
  const { email } = req.decoded;
  const { password } = req.body;

  const encrypted = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  await User.updateOne({ email }, { password: encrypted }).exec();

  res.status(200).json({
    message: 'success',
  });
};

export const findPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).exec();

  if (user) {
    res.status(200).json({
      message: 'success',
    });

    const token = crypto.randomBytes(20).toString('hex');

    ResetToken.create({
      value: token,
      email,
      createdAt: Date.now(),
      ttl: 5 * 60 * 1000, // 5 minutes
    });

    console.log(config.SOTREE_EMAIL, config.SOTREE_PASSWORD);

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
      subject: '[대학생을 위한 리워드 기반 Q&A 플랫폼] 비밀번호 찾기 이메일입니다.',
      html:
        '비밀번호 재설정을 위해 아래의 URL로 이동해주세요. <br>' +
        `<a href='https://sw.bisue.shop/auth/reset?token=${token}'> https://sw.bisue.shop/auth/reset?token=${token} </a>`, // 프론트 URL
    });
  } else {
    res.status(400).json({
      error: 'The account with that email address does not exist',
    });
  }
};

export const resetPassword = async (req, res) => {
  const { userToken, password } = req.body;

  const token = await ResetToken.findOne({ value: userToken }).exec();

  await ResetToken.deleteOne({ value: userToken }).exec();

  const timeDiff = Date.now() - token.createdAt;

  console.log(timeDiff);
  console.log(token.ttl);

  if (timeDiff <= token.ttl) {
    const encrypted = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

    await User.updateOne({ email: token.email }, { password: encrypted }).exec();

    res.status(200).json({
      message: 'success',
    });
  } else {
    res.status(400).json({
      error: 'Invalid Token',
    });
  }
};
