import database from '@/configs/firebase';
import UserModel from '@/models/UserModel';

export const models = {
  UserModel: new UserModel(database),
};
