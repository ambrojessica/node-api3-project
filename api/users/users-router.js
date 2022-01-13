const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const Post = require('../posts/posts-model');
const User = require('./users-model');
const { logger, validateUserId, validateUser, validatePost } = require('../middleware/middleware.js');

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
    .then(user => {
      res.status(200).json(user);
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert(req.body)
    .then(newUser => {
      res.json(newUser);
    })
    .catch(err => next(err));
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  User.update(req.params.id, req.body)
    .then(updatedUser =>
      res.json(updatedUser)
    )
    .catch(err =>
      next(err)
    );
});

router.delete('/:id', validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  User.remove(req.params.id)
    .then(() => {
      res.json(req.user);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;

  try {
    const fetchPost = await User.getUserPosts(id);
    res.json(fetchPost);
  }
  catch (err) {
    next(err);
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const update = await Post.insert({
    user_id: req.params.id,
    text: req.body.text,
  });
  res.status(201).json(update);
});

// do not forget to export the router
module.exports = router;
