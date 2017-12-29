import UserModel from '../models/user';

export const passportLocalCallback = (req, username, password, done) => {
  UserModel.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'Incorrect credentials.'
      });
    }
    if (user.isRemove) {
      return done(null, false, {
        message: 'You are removed by administrator'
      });
    }
    if (!user.validPassword(user.password, password)) {
      return done(null, false, {
        message: 'Incorrect credentials.'
      });
    }
    UserModel.findByIdAndUpdate(user._id, {
      $set: {
        ip: req.connection.remoteAddress,
        lastLogin: new Date()
      }
    }).exec();
    return done(null, user);
  });
}
export const toLocalParams = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
}
