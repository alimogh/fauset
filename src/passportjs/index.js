import passport from 'passport';
import {
  Strategy as LocalStrategy
} from 'passport-local';
import UserModel from '../models/user';


import {
  passportLocalCallback,
  toLocalParams
} from './passport-local';


passport.use("local", new LocalStrategy(toLocalParams, passportLocalCallback));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user);
  });
});

export default passport;
