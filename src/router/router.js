const { Router } = require('express');
const moment = require('moment')

// Model
const Story = require('../models/Story');
// Middleware authenticate
const { ensureGuest, ensureAuth, date } = require('../middleware/auth');

const router = Router();

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login.ejs', {
    title: 'StoryBooks Login',
    h1: 'Login',
  });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => { 
  try {
    // lean() is mongoose method to return plain js object
    const stories = await Story.find({ user: req.user.id }).lean();
    // Добавляем библиотеку в опции и из шаблона используем её
    res.render('dashboard.ejs', {
      title: 'Dashboard',
      name: req.user.displayName,
      stories,
      moment
    });
  } catch (error) {
    console.error(error);
    res.render('500.ejs', { title: 'Server Error' });
  }
});

module.exports = router;
