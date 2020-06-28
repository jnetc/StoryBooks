const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, cb) => {
        const { id, displayName, name, photos } = profile;
        // Создаем нового пользователя
        const newUser = new User({
          googleId: id,
          displayName,
          firstName: name.givenName,
          lastName: name.familyName || 'Without lastname',
          image: photos[0].value,
        });
        try {
          // Ищем в базе пользователя с таким же ID
          let userExist = await User.findOne({ googleId: profile.id });
          // Проверяем
          if (!userExist) {
            // Если нет, создаем нового в базу
            // и возвращаем данные для редиректа
            const user = await User.create(newUser);
            return cb(null, user);
          } else {
            // Если есть, возвращаем данные для редиректа
            return cb(null, userExist);
          }
        } catch (error) {
          console.error(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
