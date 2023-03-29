import { Router, Request, Response, NextFunction } from 'express';
import { auth } from '../controllers/auth';
import { celebrate, Joi } from 'celebrate';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    auth.SignUp,
  );
  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    auth.SignIn,
  );
  route.post('/logout', middlewares.isAuth, auth.SignOut);
};
