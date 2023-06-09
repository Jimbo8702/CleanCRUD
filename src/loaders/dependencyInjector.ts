import { Container } from 'typedi';
import LoggerInstance from './logger';
import config from '@/config';

export default ({ models }: { models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    Container.set('logger', LoggerInstance);
    //inject mailer instance

    LoggerInstance.info('logger and models injected into container');
  } catch (e) {
    LoggerInstance.error('Error on dependency injector loader: %o', e);
    throw e;
  }
};
