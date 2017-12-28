import express from 'express';
import passport from '../passportjs/index';
import path from 'path';

const router = express.Router();

router.use((req,res,next)=>{
    if(req.isAuthenticated())
    {
        next();
    }else{
        res.redirect('/auth/login');
    }
});
router.get("/", async function (req, res, next) {
    try {
        res.render('index', { temp: "temp" });
        //res.json(req.user);
    } catch (error) {
        next(error);
    }
});
router.get("/settings", async function (req, res, next) {
  try {
      res.render('settings', { user: req.user });
      //res.json(req.user);
  } catch (error) {
      next(error);
  }
});
export default router; 
