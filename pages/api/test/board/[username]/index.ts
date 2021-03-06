import { NextApiRequest, NextApiResponse } from 'next';
import Board from 'lib/mongoDB/models/Board';
import { dbConnect } from 'lib/mongoDB/dbConnect';
import Profile from 'lib/mongoDB/models/Profile';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  const { username } = req.query;

  const profile = await Profile.findOne(
    { username: username },
    { _id: 0, username: 1, name: 1, imageUrl: 1 },
  );
  if (!profile) {
    return res.status(400).json({
      status: '400',
      message: `maybe this username(path) doesn't exist! /  input 'username' : ${username}`,
    });
  }
  const board = await Board.aggregate([
    { $match: { username: username } },
    { $addFields: { board_id: { $toString: '$_id' } } },
    {
      $lookup: {
        from: 'boardFavorites',
        localField: 'board_id',
        foreignField: 'boardId',
        as: 'favorites',
      },
    },
    {
      $lookup: {
        from: 'boardComments',
        localField: 'board_id',
        foreignField: 'boardId',
        as: 'comments',
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        boardImageUrl: 1,
        content: 1,
        createdDate: 1,
        modifiedDate: 1,
        location: 1,
        favoriteCnt: { $size: '$favorites' },
        commentCnt: { $size: '$comments' },
      },
    },
  ]);
  if (!board) {
    return res.status(400).json({ status: 400, message: `get failed` });
  }
  return res.status(200).json({ writer: profile, boards: board });
}
