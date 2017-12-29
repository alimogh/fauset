import express from 'express';
import mongoose from 'mongoose';
import passport from './passportjs';
import LocalStrategy from 'passport-local';
import session from "express-session";
import flash from'express-flash';
import bodyParser from 'body-parser';
import cookieParser  from'cookie-parser';
import path from 'path';
import indexRouter from './routes/index';
import authRouter from './routes/auth';
import expressValidator from 'express-validator';
import config from '../config/config';
import helpersGetReCaptchaResponse from './helpers/recaptcha';
import helpersisisUniqueUsername from './helpers/isUniqueUsername';
import checkAddressFausetHub from './helpers/chcekAddressHub';
mongoose.Promise = global.Promise;
mongoose.connect(config.dbConnectUrl,{
    useMongoClient: true,
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
  },error => {if(error) console.log("Connect Error: ",error)});

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use("/",express.static(path.join(__dirname,"../","public")));
app.use(cookieParser(config.cookie.secret));
app.use(session({
    secret: config.cookie.secret,
    name: config.cookie.name,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: config.cookie.maxAge }
}));
app.use(expressValidator({
    errorFormatter: (param, msg, value, location)=>{
        return {param: param, message: msg, value: value, location: location};
    },
    customValidators:{
        isValidreCAPTCHA : helpersGetReCaptchaResponse,
        isUnique: helpersisisUniqueUsername,
        isFausetHubAddress: checkAddressFausetHub,
    }
}));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/index', indexRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});
app.use(function(error,req, res, next) {
    res.status(500).send(error);
    console.dir(error);
});
app.listen(process.env.PORT || 3000, function () {
    console.log('App listening on port.');
});
