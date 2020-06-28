const { Router } = require('express');
const passport = require('passport')

const router = Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    console.log(req.session);
    res.redirect('/dashboard')
  });

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.clearCookie('connect.sid')
  res.redirect('/')
})

module.exports = router;
