import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { Logger } from 'winston';

const attachUser = async (req, res, next) => {
  const Logger: Logger = Container.get('logger');
  try {
    const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
    const userRecord = await UserModel.findById(req.token._id);

    if (!userRecord) {
      return res.sendStatus(401);
    }
    const currentUser = userRecord.toObject();
    Reflect.deleteProperty(currentUser, 'password');
    Reflect.deleteProperty(currentUser, 'salt');
    req.user = currentUser;

    return next();
  } catch (e) {
    Logger.error('Error attching user to req: %o', e);
    return next(e);
  }
};

export default attachUser;
