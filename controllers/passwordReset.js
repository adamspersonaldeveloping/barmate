const User = require("../models/User")
const validator = require("validator")
const crypto = require('crypto')
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const nodemailer = require("nodemailer")
const async = require("async")


exports.getPasswordRecover = (req, res) => {
    if (req.user) {
        console.log(req.user)
        return res.redirect('/recover')
    }
    console.log(req.user)
    res.render('recover', {
        title: 'Recover Password Request'
    })
}

exports.postPasswordRecover = async (req, res) =>{

        const validationErrors = []
        if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
        if (validationErrors.length) {
            req.flash('errors', validationErrors)
            return res.redirect('/recover')
        }
       
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {   
            const errors = []
                if (!user) {
                    errors.push({ msg:"No account with that email address exists."})
                }
                if(errors.length){
                    req.flash('errors', errors);
                    return res.redirect('/recover');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.USER,
                    pass: process.env.GMAIL_SECRET
                }
            })
            const mailOptions = {
                to: user.email,
                from: 'DoNotReply@Barmate.com',
                subject: 'BarMate Password Reset Request',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return console.log(err);
        res.redirect('/emailsent');
    })
}

exports.getPasswordReset = (req, res) => {
    // if (req.user) {
    //     console.log(req.user, 'line87')
    //     return res.redirect('/reset/:token')
    // }
    console.log(req.user)
    res.render('password-reset', {
        title: 'Password Reset'
    })
}

exports.postPasswordReset = async(req,res) =>{

        const validationErrors = []
        if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
        if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })

        if (validationErrors.length) {
            req.flash('info', validationErrors)
        
        }
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    req.flash('info', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                    req.logIn(user, function (err) {
                        done(err, user);
                    });
                });
            });
        },
    ], function (err) {
        res.redirect('/feed');
    })
}

exports.getPasswordSent = (req, res) => {
      res.render("passwordResetEmailSent.ejs");
    }