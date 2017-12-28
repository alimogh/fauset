import express from 'express';
import passport from '../passportjs/index';
import path from 'path';
import {
  expressValidator
} from 'express-validator';

import config from '../../config/config';
import UserModel from '../models/user';
import {
  request
} from 'request-promise';


const router = express.Router();
const NotMastBeLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/index');
  }
};
const MastBeLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};
router.post("/login", passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/auth/login',
  failureFlash: true
}));
router.get("/login", NotMastBeLogin, async function (req, res, next) {
  try {
    res.render('auth/login', {
      message: req.flash('message'),
      errorLogin : req.flash('error'),
    });
  } catch (error) {
    next(error);
  }
});
router.post("/registration", NotMastBeLogin, async function (req, res, next) {
  try {
    req.checkBody('firstName', 'First anme can not be blank').notEmpty();
    req.checkBody('lastName', 'Last anme can not be blank').notEmpty();
    req.checkBody('username', 'Username can not be blank').notEmpty().isUnique().withMessage("Username already exists");
    req.checkBody('fhub_address', 'Fauset Hub address can not be blank').notEmpty().isFausetHubAddress().withMessage("Coin address does not belong to an account on FaucetHub.io, please make an account and link your address and try again.");
    req.checkBody('password', 'Password can not be blank').notEmpty().isLength({
      min: 5,
      max: 12
    }).withMessage('Beetwin 5-12');
    req.checkBody('confirmPassword', 'Confirm Password can not be blank').notEmpty().isLength({
      min: 5,
      max: 12
    }).withMessage('Beetwin 5-12').equals(req.body.password).withMessage('Passwords do not match');
    req.checkBody('g-recaptcha-response', 'reCAPTCHA error').isValidreCAPTCHA();
    await req.asyncValidationErrors(true);
    const user = new UserModel(req.body);
    await user.save();
    req.flash('message', "Success registration");
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
    res.render('auth/registration', {
      errors: error,
      form: req.body
    });
  }
});
router.get("/registration", NotMastBeLogin, async function (req, res, next) {
  try {
    res.render('auth/registration');
  } catch (error) {
    next(error);
  }
});
router.get("/logout", MastBeLogin, async function (req, res, next) {
  try {
    req.logOut();
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

export default router;
