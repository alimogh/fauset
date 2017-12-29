import express from 'express';
import passport from '../passportjs/index';
import path from 'path';
import UserModel from '../models/user';
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
      baseUrl: config.baseUrl,
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
    res.render('settings', {
      user: req.user,
      baseUrl: config.baseUrl,
      referals: _.isEmpty(referals)? undefined : referals,
    });
    //res.json(req.user);
  } catch (error) {
    next(error);
  }
});
router.post("/claim", async function (req, res, next) {
  try {
    const user = req.user;
    const now = Date.now();
    if(user.lastClaim < now){
      UserModel.findByIdAndUpdate(user._id,{lastClaim:(now + (config.claim.interval * 60000)),balance:(+user.balance + config.claim.price)},{new: true},(error,updatedUser)=>{
        if(error) throw error;
        // res.render('index', {
        //   user: updatedUser,
        //   baseUrl: config.baseUrl,
        // });
      });
      res.redirect("/index");
    }else{
      res.redirect("/index");
      // res.render('index', {
      //   user: user,
      //   cantclaim: ""+(user.lastClaim - now)/60000,
      //   baseUrl: config.baseUrl,
      // });
    }
    

    


    //res.json(req.user);
  } catch (error) {
    next(error);
  }
});
export default router;
