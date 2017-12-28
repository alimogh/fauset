import UserModel from '../models/user';
import 'babel-polyfill';
const isUniqueUsername = async(username) => {
  try {
    if (!await UserModel.prototype.isUniqueUsername(username)) {
      throw new Error("");
    }
  } catch (error) {
    throw error;
  }
}
export default isUniqueUsername;
