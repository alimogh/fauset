import express from 'express';
import passport from '../passportjs/index';
import request from 'request-promise';
import path from 'path';
import UserModel from '../models/user';
import PayOutModel from '../models/payout';
import config from '../../config/config';
import _ from 'lodash';


const router = express.Router();

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/auth/login');
  }
});
router.get("/", async function (req, res, next) {
  try {
    res.render('index', {
      user: req.user,
      config: config,
    });
    //res.json(req.user);
  } catch (error) {
    next(error);
  }
});
router.get("/settings", async function (req, res, next) {
  try {
    const user = req.user;
    const referals = await UserModel.find({referal:user._id}).exec();
    const payouts = await PayOutModel.find({user_id: user._id}).exec();
    res.render('settings', {
      message: req.flash('payoutmsg'),
      payouts: payouts,
      user: req.user,
      baseUrl: config.baseUrl,
      referals: _.isEmpty(referals)? undefined : referals,
    });
    //res.json(req.user);
  } catch (error) {
    next(error);
  }
});
router.post("/settings", async function (req, res, next) {
  try {
    const {satosh, address, carrentP } = req.body;
    req.checkBody('satosh', 'Mast be integer').trim().isInt();
    req.checkBody('address', "Not empty").notEmpty();
    req.checkBody('carrentP', "Not empty").notEmpty().isLength({min: 5, max: 24}).withMessage('Beetwin 5-24');
    await req.asyncValidationErrors(true);
    if(satosh < 5 ) throw new Error("Mast be mor then 75");
    const user = req.user;
    if(address !== user.fhub_address){
      throw new Error("Incorct FausetHub address");
    }
    if(satosh > parseInt(user.balance)){
      throw new Error ("balance error");
      return;
    } 
    await UserModel.findByIdAndUpdate(user._id,{$inc: { balance : -1 * parseInt(satosh) }}).exec();
    const response = await request({
      method: 'POST',
      uri: 'https://faucethub.io/api/v1/send',
      form: {
        api_key: config.faucethub.api_key,
        to : address,
        amount : parseInt(satosh),
        currency : "BTC",
        referral : false,
        ip_address : req.user.ip,
      }
    });
    const responseObj = JSON.parse(response);
    console.dir(responseObj);
    const payout = new PayOutModel({...req.body,user_id: user._id,payout_user_hash: responseObj.payout_user_hash});
    await payout.save();
    req.flash('payoutmsg', "Success payout");
    res.redirect('/index/settings');
  } catch (error) {
    console.log(error);
    const user = req.user;
    const referals = await UserModel.find({referal:user._id}).exec();
    const payouts = await PayOutModel.find({user_id: user._id}).exec();
    res.render('settings', {
      payouts: payouts,
      user: req.user,
      baseUrl: config.baseUrl,
      referals: _.isEmpty(referals)? undefined : referals,
      errors: error,
    });
  }
});
router.post("/claim", async function (req, res, next) {
  try {
    req.checkBody('g-recaptcha-response', 'reCAPTCHA error').isValidreCAPTCHA();
    await req.asyncValidationErrors(true);
    const user = req.user;
    const now = Date.now();
    if(user.lastClaim < now){
      UserModel.findByIdAndUpdate(user._id,{lastClaim:(now + (config.claim.interval * 60000)),balance:(+user.balance + config.claim.price),
        $inc: { referalAddedBalance : (config.claim.price * (config.claim.percent) / 100) }},{new: true},async (error,updatedUser)=>{
        if(error) throw error;
        if(updatedUser.referal !== null){
          await UserModel.findByIdAndUpdate(updatedUser.referal,{$inc: { balance : (config.claim.price * (config.claim.percent) / 100) }}).exec();
        }
      });
      res.redirect("/index");
    }else{
      res.redirect("/index");
    }
  } catch (error) {
    if(error.hasOwnProperty("g-recaptcha-response")){
      res.redirect("/index");
    }else{
      next(error);
    }
  }
});
export default router;
