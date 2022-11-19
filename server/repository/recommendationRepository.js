import { recommendation } from '../database/mongodb.js';

export const addRecommendation = async (from, answer) => {
  await recommendation.create({
    from,
    answer,
  });
};
