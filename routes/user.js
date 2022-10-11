const { body } = require('express-validator');
const { query } = require('express-validator');
const express = require('express');
const usercontroller = require('../controller/index');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post(
  '/login',
  [
    body('Email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('Password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  usercontroller.postLogin,
);

router.post(
  '/signup',
  [
    body('Email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      // .custom((value, { req }) => {
      //   return User.findOne({ Email: value }).then(userDoc => {
      //     if (userDoc) {
      //       return Promise.reject(
      //         'E-Mail exists already, please pick a different one.'
      //       );
      //     }
      //   });
      // })
      .normalizeEmail(),
    body(
      'Name',
      'Please enter a valid Name with Minimun 5 and maximun 15 Alphabats.',
    )
      .isLength({ min: 5, max: 15 })
      .isAlpha(),
    body(
      'Password',
      'Please enter a Password with only numbers and text and at least 5 characters.',
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body(
      'Role',
      'please enter only admin or user.',
    )
      .custom((value) => {
        if (!(value === 'admin' || value === 'user')) {
          throw new Error('please enter only admin or user.');
        }
        return true;
      })
      .isAlpha()
      .trim(),
  ],
  usercontroller.postSignup,
);
router.get('/profile', isAuth, usercontroller.getprofile);
router.put('/resetPassword', isAuth, [
  query('oldPassword', 'Please enter a Password with only numbers and text and at least 5 characters1.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  query('newPassword', 'Please enter a Password with only numbers and text and at least 5 characters2.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim()
    .custom((value, { req }) => {
      if (value === req.query.oldPassword) {
        throw new Error('newPassword must be different from old Password.');
      }
      return true;
    }),
], usercontroller.putPassword);
router.get('/stats', isAuth, usercontroller.getstats);
router.get('/tosearch', isAuth, usercontroller.getData);
module.exports = router;
