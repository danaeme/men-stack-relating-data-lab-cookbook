const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Index route to display the pantry items
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('foods/index.ejs', { pantry: user.pantry, user: user });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// New route to display the form to add a new item
router.get('/new', (req, res) => {
    console.log(req.session.user._id);
  res.render('foods/new.ejs', { userId: req.session.user._id });
});

// Create route to add a new item to the pantry
router.post('/', async (req, res) => {
    try {
    //   console.log('Request body:', req.body);
    //   console.log('User ID from params:', req.params.userId);
      const user = await User.findById(req.session.user._id);
    //   console.log('User found for create route:', user);
      user.pantry.push(req.body);
      await user.save();
      res.redirect(`/users/${req.session.user._id}/foods`);
    } catch (error) {
      console.log('Error in create route:', error);
      res.redirect('/');
    }
  });

// Delete route to delete a pantry item
router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.pantry.id(req.params.itemId).remove();
    await user.save();
    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (error) {
    console.log('Error in delete route:', error);

    res.redirect('/');
  }
});

// Edit route to display the form to edit an item
router.get('/:itemId/edit', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const foodItem = user.pantry.id(req.params.itemId);
        res.render('foods/edit.ejs', { userId: req.session.user._id, item: foodItem });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

// Update route to update a pantry item
router.put('/:itemId', async (req, res) => {
    try {
    const user = await User.findById(req.session.user._id);
      const foodItem = user.pantry.id(req.params.itemId);
      foodItem.set(req.body);
      await user.save();
      res.redirect(`/users/${req.session.user._id}/foods`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

module.exports = router;