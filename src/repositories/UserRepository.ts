import { UUID, randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { models } from '@/models';
import {
  IUserRepository,
  UserWithRolesResponse,
} from '@/interfaces/repositories/IUserRepository';
import IUserModel from '@/interfaces/models/IUserModel';

const { UserModel } = models;

/**
 * @class UserRepository
 */
class UserRepository implements IUserRepository {
  /**
   * Generate Hash Password
   * @param {string} password - The user password
   * @return {string} The user
   * @private
   */
  private generateHashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  /**
   * @method findUserWithRolesById
   * @param {UUID} userId - used to find user
   * @returns {Promise<IUserRepositoryFindUserWithRolesById | null>} - returns user with roles
   */
  public async findUserWithRolesById(userId: UUID): Promise<UserWithRolesResponse | null> {
    const snapshot = await UserModel.collection.where('id', '==', userId).get();

    if (snapshot.empty) return null;

    const [doc] = snapshot.docs;

    return doc.data();
  }

  /**
 * @method findUserById
 * @param {UUID} userId - used to find user
 * @returns {Promise<IUserModel | null>} - returns user with roles
 */
  public async findUserById(userId: UUID): Promise<IUserModel | null> {
    const snapshot = await UserModel.collection.where('id', '==', userId).get();

    if (snapshot.empty) return null;

    const [doc] = snapshot.docs;

    const user = { ...doc.data() };

    delete user.password;

    return user as IUserModel;
  }

  /**
   * @method findUserByEmail
   * @param {string} email - used to find user
   * @returns {Promise<IUserModel | null>} - returns user
   */
  public async findUserByEmail(email: string): Promise<IUserModel | null> {
    const snapshot = await UserModel.collection.where('email', '==', email).get();

    if (snapshot.empty) return null;

    const [doc] = snapshot.docs;

    return doc.data() as IUserModel;
  }

  /**
   * @method createUser
   * @param {{name: string;bio: string;phone: string;email: string;password: string;}} user - used to create user
   */
  public async createUser(user: {
    name: string;
    bio: string;
    phone: string;
    email: string;
    password: string;
  }): Promise<{ id: UUID; }> {
    const id = randomUUID();
    const password = this.generateHashPassword(user.password);
    await UserModel.collection.doc(id).set({ id, ...user, password });
    return { id };
  }
}

export default UserRepository;
