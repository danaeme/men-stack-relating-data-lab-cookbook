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
    console.log('Rendering item form for user:', req.session.user._id);
 
  res.render('foods/new.ejs', { userId: req.session.user._id });
});

// Create route to add a new item to the pantry
router.post('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.pantry.push(req.body);
    await user.save();
    res.redirect(`/users/${req.params.userId}/foods`);
  } catch (error) {
    console.log('Error in create route:', error);
    res.redirect('/');
  }
});

// Delete route to delete a pantry item
router.delete('/:userId/foods/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);    
    user.pantry.id(req.params.itemId).remove();
    await user.save();
    res.redirect(`/users/${req.params.userId}/foods`);
  } catch (error) {
    console.log('Error in delete route:', error);

    res.redirect('/');
  }
});

// Edit route to display the form to edit an item
router.get('/:userId/foods/:itemId/edit', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const foodItem = user.pantry.id(req.params.itemId);
      res.render('foods/edit.ejs', { userId: req.params.userId, item: foodItem });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

// Update route to update a pantry item
router.put('/:userId/foods/:itemId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const foodItem = user.pantry.id(req.params.itemId);
      foodItem.set(req.body);
      await user.save();
      res.redirect(`/users/${req.params.userId}/foods`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

module.exports = router;