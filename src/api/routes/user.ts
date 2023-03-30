import { Router } from 'express';
import middlewares from '../middlewares';
import { user } from '../controllers/user';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get('/me', middlewares.isAuth, middlewares.attachUser, user.GetUser);
};
