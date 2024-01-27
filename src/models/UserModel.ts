import IUserModel from '@/interfaces/models/IUserModel';
import * as admin from 'firebase-admin';

/**
 * @class UserModel
 */
class UserModel implements IUserModel {
  private readonly _database: admin.firestore.Firestore;
  private readonly _collectionName: string;
  public readonly collection: admin.firestore.CollectionReference;

  /**
   * Note '!' is required in strict mode
   */
  public id!: string;
  public name!: string;
  public bio!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public avatar!: string;
  public roles!: string[];

  /**
   * Constructor
   * @param {admin.firestore.Firestore} database - firestore database
   * @constructor
   */
  constructor(database: admin.firestore.Firestore) {
    this._database = database;
    this._collectionName = 'Users';
    this.collection = this._database.collection(this._collectionName);
  }
}

export default UserModel;
