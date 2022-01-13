const User = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(req.method, req.url, req.timestamp);
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const user = await User.getById(req.params.id);

  try {
    if (user) {
      req.user = user;
      next();
    } else {
      next({
        status: 404,
        message: 'user not found'
      });
    }
  }
  catch (err) {
    next(err);
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if (!req.body.name) {
    next({
      status: 400,
      message: 'missing required name field'
    });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if (!req.body.text) {
    next({
      status: 400,
      message: 'missing required text field'
    });
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
};