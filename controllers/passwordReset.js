const User = require("../models/User");
const validator = require("validator");
const crypto = require("crypto");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const nodemailer = require("nodemailer");
const async = require("async");
const flash = require("express-flash");
const { syncBuiltinESMExports } = require("module");

exports.getPasswordRecover = (req, res) => {
  if (req.user) {
    console.log(req.user);
    return res.redirect("/recover");
  }
  console.log(req.user);
  res.render("recover", {
    title: "Recover Password Request",
  });
};

exports.postPasswordRecover = async (req, res) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/recover");
  }

  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      // refactored to use async await instead of a callback for .findOne() because mongoose no longer supports callbacks in this method
      async function (token, done) {
        try {
          const user = await User.findOne({ email: req.body.email });
          const errors = [];
          if (!user) {
            errors.push({ msg: "No account with that email address exists." });
          }
          if (errors.length) {
            req.flash("errors", errors);
            return res.redirect("/recovery");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; //1hour

          // user.save(function (err) {
          //   done(err, token, user);
          // });
          await user.save();
          // done(null, token, user);
        } catch (err) {
          done(err);
        }
      },

      // function (token, done) {
      //   User.findOne({ email: req.body.email }, function (err, user) {
      //     const errors = [];
      //     if (!user) {
      //       errors.push({ msg: "No account with that email address exists." });
      //     }
      //     if (errors.length) {
      //       req.flash("errors", errors);
      //       return res.redirect("/recover");
      //     }

      //     user.resetPasswordToken = token;
      //     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      //     user.save(function (err) {
      //       done(err, token, user);
      //     });
      //   });
      // },
      async function (token, user, done) {
        user = await User.findOne({ email: req.body.email });

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.USER,
            pass: process.env.GMAIL_SECRET,
          },
        });
        const mailOptions = {
          to: req.body.email,
          from: "DoNotReply@Barmate.com",
          subject: "BarMate Password Reset Request",
          context: {
            name: user.userName,
            host: req.headers.host,
            token: token,
            action_url: `http://${req.headers.host}/reset/${token}`,
          },
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
          html: `<head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="x-apple-disable-message-reformatting" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="color-scheme" content="light dark" />
                <meta name="supported-color-schemes" content="light dark" />
                <title></title>
                <style type="text/css" rel="stylesheet" media="all">
                /* Base ------------------------------ */
                
                @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
                body {
                  width: 100% !important;
                  height: 100%;
                  margin: 0;
                  -webkit-text-size-adjust: none;
                }
                
                a {
                  color: #3869D4;
                }
                
                a img {
                  border: none;
                }
                
                td {
                  word-break: break-word;
                }
                
                .preheader {
                  display: none !important;
                  visibility: hidden;
                  mso-hide: all;
                  font-size: 1px;
                  line-height: 1px;
                  max-height: 0;
                  max-width: 0;
                  opacity: 0;
                  overflow: hidden;
                }
                /* Type ------------------------------ */
                
                body,
                td,
                th {
                  font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
                }
                
                h1 {
                  margin-top: 0;
                  color: #333333;
                  font-size: 22px;
                  font-weight: bold;
                  text-align: left;
                }
                
                h2 {
                  margin-top: 0;
                  color: #333333;
                  font-size: 16px;
                  font-weight: bold;
                  text-align: left;
                }
                
                h3 {
                  margin-top: 0;
                  color: #333333;
                  font-size: 14px;
                  font-weight: bold;
                  text-align: left;
                }
                
                td,
                th {
                  font-size: 16px;
                }
                
                p,
                ul,
                ol,
                blockquote {
                  margin: .4em 0 1.1875em;
                  font-size: 16px;
                  line-height: 1.625;
                }
                
                p.sub {
                  font-size: 13px;
                }
                /* Utilities ------------------------------ */
                
                .align-right {
                  text-align: right;
                }
                
                .align-left {
                  text-align: left;
                }
                
                .align-center {
                  text-align: center;
                }
                
                .u-margin-bottom-none {
                  margin-bottom: 0;
                }
                /* Buttons ------------------------------ */
                
                .button {
                  background-color: #3869D4;
                  border-top: 10px solid #3869D4;
                  border-right: 18px solid #3869D4;
                  border-bottom: 10px solid #3869D4;
                  border-left: 18px solid #3869D4;
                  display: inline-block;
                  color: #FFF;
                  text-decoration: none;
                  border-radius: 3px;
                  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
                  -webkit-text-size-adjust: none;
                  box-sizing: border-box;
                }
                
                .button--green {
                  background-color: #22BC66;
                  border-top: 10px solid #22BC66;
                  border-right: 18px solid #22BC66;
                  border-bottom: 10px solid #22BC66;
                  border-left: 18px solid #22BC66;
                }
                
                .button--red {
                  background-color: #FF6136;
                  border-top: 10px solid #FF6136;
                  border-right: 18px solid #FF6136;
                  border-bottom: 10px solid #FF6136;
                  border-left: 18px solid #FF6136;
                }
            
                /*-------Bootstrap button --------*/
            
                .btn-outline-info {
              color: #17a2b8;
              background-color: transparent;
              background-image: none;
              border-color: #17a2b8;
            }
            
            .btn-outline-info:hover {
              color: #fff;
              background-color: #17a2b8;
              border-color: #17a2b8;
            }
            
            .btn-outline-info:focus, .btn-outline-info.focus {
              box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
            }
            
            .btn-outline-info.disabled, .btn-outline-info:disabled {
              color: #17a2b8;
              background-color: transparent;
            }
            
            .btn-outline-info:not(:disabled):not(.disabled):active, .btn-outline-info:not(:disabled):not(.disabled).active,
            .show > .btn-outline-info.dropdown-toggle {
              color: #fff;
              background-color: #17a2b8;
              border-color: #17a2b8;
            }
            
            .btn-outline-info:not(:disabled):not(.disabled):active:focus, .btn-outline-info:not(:disabled):not(.disabled).active:focus,
            .show > .btn-outline-info.dropdown-toggle:focus {
              box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
            }
            .btn {
              display: inline-block;
              font-weight: 400;
              text-align: center;
              white-space: nowrap;
              vertical-align: middle;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              border: 1px solid #17a2b8;
              padding: 0.375rem 0.75rem;
              font-size: 1rem;
              line-height: 1.5;
              border-radius: 0.25rem;
              transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }
                
                @media only screen and (max-width: 500px) {
                  .button {
                    width: 100% !important;
                    text-align: center !important;
                  }
                }
                /* Attribute list ------------------------------ */
                
                .attributes {
                  margin: 0 0 21px;
                }
                
                .attributes_content {
                  background-color: #F4F4F7;
                  padding: 16px;
                }
                
                .attributes_item {
                  padding: 0;
                }
                /* Related Items ------------------------------ */
                
                .related {
                  width: 100%;
                  margin: 0;
                  padding: 25px 0 0 0;
                  -premailer-width: 100%;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                }
                
                .related_item {
                  padding: 10px 0;
                  color: #CBCCCF;
                  font-size: 15px;
                  line-height: 18px;
                }
                
                .related_item-title {
                  display: block;
                  margin: .5em 0 0;
                }
                
                .related_item-thumb {
                  display: block;
                  padding-bottom: 10px;
                }
                
                .related_heading {
                  border-top: 1px solid #CBCCCF;
                  text-align: center;
                  padding: 25px 0 10px;
                }
                /* Discount Code ------------------------------ */
                
                .discount {
                  width: 100%;
                  margin: 0;
                  padding: 24px;
                  -premailer-width: 100%;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                  background-color: #F4F4F7;
                  border: 2px dashed #CBCCCF;
                }
                
                .discount_heading {
                  text-align: center;
                }
                
                .discount_body {
                  text-align: center;
                  font-size: 15px;
                }
                /* Social Icons ------------------------------ */
                
                .social {
                  width: auto;
                }
                
                .social td {
                  padding: 0;
                  width: auto;
                }
                
                .social_icon {
                  height: 20px;
                  margin: 0 8px 10px 8px;
                  padding: 0;
                }
                /* Data table ------------------------------ */
                
                .purchase {
                  width: 100%;
                  margin: 0;
                  padding: 35px 0;
                  -premailer-width: 100%;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                }
                
                .purchase_content {
                  width: 100%;
                  margin: 0;
                  padding: 25px 0 0 0;
                  -premailer-width: 100%;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                }
                
                .purchase_item {
                  padding: 10px 0;
                  color: #51545E;
                  font-size: 15px;
                  line-height: 18px;
                }
                
                .purchase_heading {
                  padding-bottom: 8px;
                  border-bottom: 1px solid #EAEAEC;
                }
                
                .purchase_heading p {
                  margin: 0;
                  color: #85878E;
                  font-size: 12px;
                }
                
                .purchase_footer {
                  padding-top: 15px;
                  border-top: 1px solid #EAEAEC;
                }
                
                .purchase_total {
                  margin: 0;
                  text-align: right;
                  font-weight: bold;
                  color: #333333;
                }
                
                .purchase_total--label {
                  padding: 0 15px 0 0;
                }
                
                body {
                  background-color: #F2F4F6;
                  color: #51545E;
                }
                
                p {
                  color: #51545E;
                }
                
                .email-wrapper {
                  width: 100%;
                  margin: 0;
                  padding: 0;
                  -premailer-width: 100%;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                  background-color: #F2F4F6;
                }
                
                .email-content {
                  width: 100%;
                  margin: 0;
                  padding: 0;
                  -premailer-width: 100%;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                }
                /* Masthead ----------------------- */
                
                .email-masthead {
                  padding: 25px 0;
                  text-align: center;
                }
                
                .email-masthead_logo {
                  width: 94px;
                }
                
                .email-masthead_name {
                  font-size: 16px;
                  font-weight: bold;
                  color: #A8AAAF;
                  text-decoration: none;
                  text-shadow: 0 1px 0 white;
                }
                /* Body ------------------------------ */
                
                .email-body {
                  width: 100%;
                  margin: 0;
                  padding: 0;
                  -premailer-width: 100%;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                }
                
                .email-body_inner {
                  width: 570px;
                  margin: 0 auto;
                  padding: 0;
                  -premailer-width: 570px;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                  background-color: #FFFFFF;
                }
                
                .email-footer {
                  width: 570px;
                  margin: 0 auto;
                  padding: 0;
                  -premailer-width: 570px;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                  text-align: center;
                }
                
                .email-footer p {
                  color: #A8AAAF;
                }
                
                .body-action {
                  width: 100%;
                  margin: 30px auto;
                  padding: 0;
                  -premailer-width: 100%;
                  -premailer-cellpadding: 0;
                  -premailer-cellspacing: 0;
                  text-align: center;
                }
                
                .body-sub {
                  margin-top: 25px;
                  padding-top: 25px;
                  border-top: 1px solid #EAEAEC;
                }
                
                .content-cell {
                  padding: 45px;
                }
                /*Media Queries ------------------------------ */
                
                @media only screen and (max-width: 600px) {
                  .email-body_inner,
                  .email-footer {
                    width: 100% !important;
                  }
                }
                
                @media (prefers-color-scheme: dark) {
                  body,
                  .email-body,
                  .email-body_inner,
                  .email-content,
                  .email-wrapper,
                  .email-masthead,
                  .email-footer {
                    background-color: #333333 !important;
                    color: #FFF !important;
                  }
                  p,
                  ul,
                  ol,
                  blockquote,
                  h1,
                  h2,
                  h3,
                  span,
                  .purchase_item {
                    color: #FFF !important;
                  }
                  .attributes_content,
                  .discount {
                    background-color: #222 !important;
                  }
                  .email-masthead_name {
                    text-shadow: none !important;
                  }
                }
                
                :root {
                  color-scheme: light dark;
                  supported-color-schemes: light dark;
                }
                </style>
                <!--[if mso]>
                <style type="text/css">
                  .f-fallback  {
                    font-family: Arial, sans-serif;
                  }
                </style>
              <![endif]-->
              </head>
              <body>
                <span class="preheader">Use this link to reset your password. The link is only valid for 1 hour.</span>
                <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td align="center">
                      <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td class="email-masthead">
                            <a href="https://barmate.bar" class="f-fallback email-masthead_name">
                            BarMate
                          </a>
                          </td>
                        </tr>
                        <!-- Email Body -->
                        <tr>
                          <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                            <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                              <!-- Body content -->
                              <tr>
                                <td class="content-cell">
                                  <div class="f-fallback">
                                    <h1>Hi ${user.userName},</h1>
                                    <p>You recently requested to reset your password for your BarMate account. Use the button below to reset it. <strong>This password reset is only valid for the next 1 hour (60 minutes).</strong></p>
                                    <!-- Action -->
                                    <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                      <tr>
                                        <td align="center">
                                          <!-- Border based button
                       https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                                          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                            <tr>
                                              <td align="center">
                                                <a href="http://${req.headers.host}/reset/${token}" class="f-fallback btn button btn-outline-info" target="_blank">Reset your password</a>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                    <p>You are receiving this because you (or someone else) have requested the reset of the password for your account. If you did not request a password reset, please ignore this email.</p>
                                    <p>Thanks,
                                      <br>The BarMate team</p>
                                    <!-- Sub copy -->
                                    <table class="body-sub" role="presentation">
                                      <tr>
                                        <td>
                                          <p class="f-fallback sub">If you’re having trouble with the button above, copy and paste the URL below into your web browser.</p>
                                          <p class="f-fallback sub">http://${req.headers.host}/reset/${token}</p>
                                        </td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td class="content-cell" align="center">
                                  <p class="f-fallback sub align-center">
                                    &copy; 2023 BarMate
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>`,
        };

        await transporter.sendMail(mailOptions);
        req.flash("info", {
          msg:
            "an e-mail has been sent to " +
            user.email +
            " with further instructions.",
        });

        // transporter.sendMail(mailOptions, function (err) {
        //   req.flash(
        //     "info",
        //     "An e-mail has been sent to " +
        //       user.email +
        //       " with further instructions."
        //   );
        //   done(err, "done");
        // });
      },
    ],
    function (err) {
      if (err) return console.log(err);
      res.redirect("/emailsent");
    }
  );
};

exports.getPasswordReset = (req, res) => {
  // if (req.user) {
  //     console.log(req.user, 'line87')
  //     return res.redirect('/reset/:token')
  // }
  console.log(req.user);
  res.render("password-reset", {
    title: "Password Reset",
  });
};

exports.isPasswordValid = (req) => {
  const pass = req.body.password;
  if (
    validator.isStrongPassword(pass, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      maxLength: 32,
    }) &&
    pass !== req.body.confirmPassword
  ) {
    return true;
  }

  const validationErrors = [];
  const passMap = {
    len: pass.length,
    upperCount: 0,
    lowerCount: 0,
    numCount: 0,
  };
  const upperCaseRegex = /^[A-Z]$/;
  const lowerCaseRegex = /^[a-z]$/;
  const numberRegex = /^[0-9]$/;
  for (const char of pass) {
    if (upperCaseRegex.test(char)) {
      passMap.upperCount++;
    } else if (lowerCaseRegex.test(char)) {
      passMap.lowerCount++;
    } else if (numberRegex.test(char)) {
      passMap.numCount++;
    }
  }
  if (passMap.len < 8) {
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  }
  if (passMap.len > 32) {
    validationErrors.push({
      msg: "Password must NOT be more than 32 characters long",
    });
  }
  if (passMap.upperCount === 0) {
    validationErrors.push({
      msg: "PASSWORD MUST HAVE AT LEAST 1 UPPERCASE LETTER",
    });
  }
  if (passMap.lowerCount === 0) {
    validationErrors.push({
      msg: "password must have at least 1 lowercase letter",
    });
  }
  if (passMap.numCount === 0) {
    validationErrors.push({
      msg: "Pa55w0rd mu57 4av3 a7 l3ast 1 numb3r",
    });
  }
  if (pass !== req.body.confirmPassword) {
    validationErrors.push({
      msg: "Passwords do not match",
    });
  }

  // if(validationErrors.length > 3){
  //   console.log('Have you ever tried to make a password before?')
  // }

  return validationErrors.length ? validationErrors : true;
};

exports.postPasswordReset = async (req, res) => {
  const validPass = isPasswordValid(req);
  if (!validPass === true) {
    req.flash("info", validPass);
  }
  //previous simple validation 1.0
  // const validationErrors = []
  // if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
  // if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })

  // if (validationErrors.length) {
  //     req.flash('info', validationErrors)

  // }
  async.waterfall(
    [
      //refractored using async await
      async function (done) {
        try {
          const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          });

          if (!user) {
            req.flash("info", "Password rest token is invalid or has expired.");
            return res.redirect("back");
          }
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          await user.save();

          req.logIn(user, function (err) {
            done(err, user);
          });
        } catch (err) {
          console.log(err);
        }
      },

      // function (done) {
      //   //need to refractor
      //   User.findOne(
      //     {
      //       resetPasswordToken: req.params.token,
      //       resetPasswordExpires: { $gt: Date.now() },
      //     },
      //     function (err, user) {
      //       if (!user) {
      //         req.flash(
      //           "info",
      //           "Password reset token is invalid or has expired."
      //         );
      //         return res.redirect("back");
      //       }

      //       user.password = req.body.password;
      //       user.resetPasswordToken = undefined;
      //       user.resetPasswordExpires = undefined;

      //       user.save(function (err) {
      //         req.logIn(user, function (err) {
      //           done(err, user);
      //         });
      //       });
      //     }
      //   );
      // },
    ],
    function (err) {
      res.redirect("/feed");
    }
  );
};

exports.getPasswordSent = (req, res) => {
  res.render("passwordResetEmailSent.ejs");
};
