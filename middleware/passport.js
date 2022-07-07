const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const userController = require('../controllers/userController');
const { database } = require('../models/userModel');
const localLogin = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: 'Your login details are not valid. Please try again',
        });
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: 'User not found' }, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: '29561256846ace717762',
      clientSecret: 'bd6693c1f29ad72e20e3fd09586382d2312e940a',
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      let user = userController.getGitUserOrCreate(profile);
      if (user) {
        return done(null, user);
      } else {
        done(null, false, {
          message: 'Your login details are not valid. Please try again',
        });
      }
    }
  )
);

module.exports = passport.use(localLogin);
