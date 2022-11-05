import { config } from '../config.js';
import jwt from 'jsonwebtoken';

export const isAuth = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    req.decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    next();
  } catch {
    res.status(400).json({
      error: 'Invalid Token',
    });
  }
};
