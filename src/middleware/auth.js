module.exports = {
  ensureAuth: function (req, res, next) {
    // Проверяем автаризирован пользователь
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/');
    }
  },
  // Проверяем автаризирован гость
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/dashboard');
    } else {
      return next();
    }
  },
};
