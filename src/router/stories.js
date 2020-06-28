const { Router } = require('express');
const moment = require('moment')

// Model
const Story = require('../models/Story');
// Middleware authenticate
const { ensureAuth } = require('../middleware/auth');
// Import helpers function
const { editIcon } = require('../helpers/editIconFunc');

const router = Router();

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('add-story.ejs', {
    title: 'Add story',
  });
});

// @desc    Process add form
// @route   POST /stories
router.post('/add', ensureAuth, async (req, res) => {
  try {
    await Story.create({ user: req.user.id, ...req.body });
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('500.ejs', { title: 'Server Error' });
  }
});

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('stories.ejs', {
      title: 'Stories',
      stories,
      user: req.user,
      editIcon,
    });
  } catch (error) {
    console.error(error);
    res.render('500.ejs', { title: 'Server Error' });
  }
});

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();
    console.log(story);

    if (!story) {
      return res.render('404.ejs');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    }

    res.render('edit-story.ejs', {
      title: 'Edit your story',
      story,
    });
  } catch (error) {
    console.error(error);
    res.render('500.ejs', { title: 'Server Error' });
  }
});

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id);

    if (!story) {
      return res.render('404.ejs');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      story = await Story.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect('/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.render('500.ejs', { title: 'Server Error' });
  }
});

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Story.findByIdAndRemove({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('500.ejs', { title: 'Server Error' });
  }
});

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean();

    if (!story) {
      return res.render('404.ejs');
    }

    res.render('story.ejs', {
      title: 'Your story',
      story,
      user: req.user,
      moment,
      editIcon,
    });
  } catch (error) {
    console.error(error);
    res.render('500.ejs', { title: 'Server Error' });
  }
});

// @desc    Show user stories
// @route   GET /stories/user/:id
router.get('/user/:id', ensureAuth, async(req, res) => {
  try {
    const stories = await Story.find({user: req.params.id, status: 'public' }).populate('user').lean()
  
    res.render('stories.ejs', {
      title: 'User stories',
      stories,
      editIcon,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.render('500.ejs', { title: 'Server Error' });
  }
  
});

module.exports = router;
