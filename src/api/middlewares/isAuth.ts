import config from '@/config';
import { expressjwt } from 'express-jwt';

const getTokenFromHeader = req => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const isAuth = expressjwt({
  secret: config.jwtSecret, // The _secret_ to sign the JWTs
  algorithms: ['RS256'], // JWT Algorithm
  requestProperty: 'token',
  getToken: getTokenFromHeader, // How to extract the JWT from the request
});

export default isAuth;
