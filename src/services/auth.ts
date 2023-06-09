import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'node:crypto';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';

@Service()
export default class AuthService {
  constructor(@Inject('userModel') private userModel: Models.UserModel, @Inject('logger') private logger) {}

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
    try {
      const salt = randomBytes(32);

      this.logger.silly('Hasing password');
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      this.logger.silly('Creating user db record');
      const userRecord = await this.userModel.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });

      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      //send email here

      //add mapper layer?
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) {
      throw new Error('User not registered');
    }

    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */

    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      this.logger.silly('Password is valid');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      return { user, token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }
}
