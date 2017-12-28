import mongoose from 'mongoose';
import crypto from 'crypto';
import passport from '../passportjs/index';
import isUniqueUsername from '../helpers/isUniqueUsername';
import {getPayootUserHashFausetHub} from '../helpers/chcekAddressHub';
import config from '../../config/config';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  username: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  fhub_address: {
    type: String,
    required: true
  },
  payootUserHashFausetHub:{
    type: String,
  },
  lastClaim: {
    type: Date,
    default: Date.now
  },
  creatAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String,
    default: "198.168.0.1"
  },
  isRemove: {
    type: Boolean,
    default: false
  },
});
UserSchema.pre('save',async function (next) {
  this.password = crypto.createHmac('sha512', config.password.secret).update(this.password).digest('hex');
  this.payootUserHashFausetHub = await getPayootUserHashFausetHub(this.fhub_address);
  next();
});
const UserModel = mongoose.model('UserSchema', UserSchema);

UserModel.prototype.validPassword = (selfpassword, password) => {
  if (selfpassword === crypto.createHmac('sha512', config.password.secret).update(password).digest('hex'))
    return true;
  return false;
}
UserModel.prototype.isUniqueUsername = async(username) => {
  try {
    const user = await UserModel.findOne({
      username: username
    }).exec();
    if (user === null) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
}
export default UserModel;
