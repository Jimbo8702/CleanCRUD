import express from 'express';
import cors from 'cors';
import routes from '@/api';
import config from '@/config';

export default ({ app }: { app: express.Application }) => {
  //health check endpoint

  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  //cors
  app.use(cors());

  //req.body => json
  app.use(express.json());

  //API routes
  app.use(config.api.prefix, routes());

  // catch 404 and forward to error handler
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });

  //handleError
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
