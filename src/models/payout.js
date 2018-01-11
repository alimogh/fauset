import mongoose from 'mongoose';
import moment from 'moment';
import config from '../../config/config';
const Schema = mongoose.Schema;

const payOutSchema = new Schema({
  user_id:{
    type: Schema.Types.ObjectId,
    ref : "UserSchema",
    required : true,
  },
  satosh : {
    type : Number, required : true,
  },
  address : {
    type : String, required : true,
  },
  creatAt: {
    type: Date,
    default: Date.now,
    get: (date)=>moment(date).format('YYYY-MM-DD HH:mm:ss'),
  },
  payout_user_hash: {
    type: String,
    required : true,
  }
});

const payOutModel = mongoose.model('payOutSchema', payOutSchema);

export default payOutModel;
