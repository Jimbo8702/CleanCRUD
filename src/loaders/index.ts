import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

export default async ({ expressApp }) => {
  //load mongo
  await mongooseLoader();
  Logger.info('DB loaded and connected');

  //models
  const userModel = {
    name: 'userModel',
    model: require('../models/user').default,
  };

  //inject models
  await dependencyInjectorLoader({ models: [userModel] });
  Logger.info('Dependencies injected');

  //load express
  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};
