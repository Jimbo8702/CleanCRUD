import 'reflect-metadata';

import config from './config';

import express from 'express';

//logger

async function startServer() {
  const app = express();

  //load loaders
  await require('./loaders').default({ expressApp: app });

  app
    .listen(config.port, () => {
      //logger
    })
    .on('error', err => {
      //logger
      process.exit(1);
    });
}

startServer();
