const passport = require("passport");
const errorhandler = require("../util/errorhandler");
const bcrypt = require("bcrypt");
const user = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
exports.auth = async (username, password, done) => {
  try {
    let User = await user.findOne({ email: username });
    if (!user) {
      return done(new errorhandler(401, "user not found"));
    }
    const check = await bcrypt.compare(password, User.password);
    if (!check) {
      return done(new errorhandler(401, "user not found"));
    }
    return done(null, User);
  } catch (err) {
    return done(new errorhandler(401, "user not found"));
  }
};

passport.serializeUser((User, done) => {
  return done(null, User.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const User = await user.findById(id);
    return done(null, User);
  } catch (err) {
    return done(new errorhandler(401, "user not found"));
  }
});
exports.authinticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(new errorhandler(400, "please login"));
  }
};

exports.logout = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(new errorhandler(500, "internal server error"));
    }
    res.status(201).json({
      success: true,
      message: `logout successfylly `,
    });
  });
};

exports.loginSuccess = (req, res, next) => {
  res.status(200).json({ success: true, message: "suceessfully login" });
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const User = await user.findById(req.user._id);
    const check = await bcrypt.compare(oldPassword, User.password);
    if (!check) {
      return next(new errorhandler(401, "please enter valid password"));
    }
    if (!newPassword === confirmPassword) {
      return next(
        new errorhandler(401, "confirm password not match with actual password")
      );
    }

    const crypted = await bcrypt.hash(newPassword, 10);
    User.password = crypted;
    await User.save();
    res
      .status(201)
      .json({ success: true, message: "your password successfully change" });
  } catch (error) {
    return next(new errorhandler(500, "internal server error"));
  }
};

exports.sendResteMail = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.SMPT_PORT,
      secure: true,
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    const reset =  crypto.randomBytes(15).toString("hex");
    const resetToken =  crypto
      .createHash("sha256")
      .update(reset)
      .digest("hex");
    const url = `${process.env.PRO}://${process.env.HOST_NAME}/api/v1/${reset}`;
    const message = `click the link reset password\n\n${url}`;
    let User = await user.findOne({ email: req.body.email });
    User.resetToken = resetToken;
    User.experyTokenDay= new Date(Date.now()+process.env.EXPIRY_TOKEN_DATE*24*60*60*1000)
    await User.save();
    const info = await transporter.sendMail({
      from: process.env.SMPT_MAIL,
      to: req.body.email,
      subject: "forgot password",
      text: message,
    });
    res.status(201).json({ success: true, message: "check your email " });
  } catch (error) {

    return next(new errorhandler(500, "Internal Server Error"));
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const token = await crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const User = await  user.findOne({
      resetToken: token,
      experyTokenDay:{$gt:Date.now()}

    });


    if (!User) {
      return new errorhandler(409, "invalid token please try again ");
    }

    if (!req.body.newPassword === req.body.confirmPassword) {
      return new errorhandler(
        409,
        "password and confirm Password doesnot match"
      );
    }
    const crypted = await bcrypt.hash(req.body.newPassword, 10);
    User.password = crypted;
    User.resetToken = undefined; 
    User.experyTokenDay = undefined; 
  
    await User.save();

    res
      .status(201)
      .json({ success: true, message: "your password successfully change" });
  } catch (error) {

    return next(new errorhandler(500, "internal server error"));
  }
};




