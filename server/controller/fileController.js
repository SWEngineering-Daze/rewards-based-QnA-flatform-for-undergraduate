import path from 'path';
import { File } from '../database/mongodb.js';

const __dirname = path.resolve();

export const downloadFileById = async (req, res) => {
  const id = req.params.id;

  const file = await File.findOne({ _id: id });

  res.download(`${__dirname}/uploadedFiles/${file.fileName}`);
};
