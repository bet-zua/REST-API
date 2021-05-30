const express = require('express');
const { User } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();


// Route that returns the currently authenticated user and a 200 HTTP status code
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
  
    res.status(201).json({
        "First name": user.firstName,
        "Last name": user.lastName,
        "Username": user.emailAddress
    });
}));
  
// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location( '/' ).json({ message: 'Account successfully created!' }).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }));


module.exports = router;
