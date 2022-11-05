import dotenv from 'dotenv';
dotenv.config();

const getEnvironmentVariable = (key) => {
  const value = process.env[key] || null;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
};

export const config = {
  PORT: parseInt(getEnvironmentVariable('PORT')),
  JWT_SECRET_KEY: getEnvironmentVariable('JWT_SECRET_KEY'),
  BCRYPT_SALT_ROUNDS: parseInt(getEnvironmentVariable('BCRYPT_SALT_ROUNDS')),
  DB_USER: getEnvironmentVariable('DB_USER'),
  DB_PASSWORD: getEnvironmentVariable('DB_PASSWORD'),
  SOTREE_EMAIL: getEnvironmentVariable('SOTREE_EMAIL'),
  SOTREE_PASSWORD: getEnvironmentVariable('SOTREE_PASSWORD'),
};
