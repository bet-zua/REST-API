const express = require('express');
const { User, Course } = require('./models');
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
      res.status(201).location( '/' ).json({ message: 'User successfully created!' }).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }));

// Route that returns a list of all courses including the User that owns each course 
router.get('/courses', asyncHandler(async (req, res) => {
    const list = await Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        include: [{
            model: User,
            attributes: [ 'firstName', 'lastName', 'emailAddress' ],
        }]
    });
    res.status(200).json(list);
}));

// Route that returns the corresponding course along with the User that owns that course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk( req.params.id, {
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        include: [{
            model: User,
            attributes: [ 'firstName', 'lastName', 'emailAddress' ],
        }]
      });
    if (course === null) {
        const err = new Error('Course does not exist.');
        throw err.status(404);
    } else { res.json(course); }
}));

// Route that creates a new course, sets location header to URI for newly created course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const user = req.currentUser;
        const course = await Course.create({ ...req.body, userId: user.id });
        await Course.create(req.body);
        res.status(201).location(`/api/courses/${course.id}`).json({ message: 'Course successfully created!' }).end();
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });
        } else {
          throw error;
        }
    }
}));

// Route that updates corresponsing course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const user = req.currentUser;
        const course = await Course.findByPk( req.params.id );
        if ( course === null ) {
          const error = new Error('Course does not exist.');
          throw error.status(404);
        } else if ( course.userId === user.id ) {
          await course.update( req.body );
          res.status(204).end();
        } else {
          res.status(403).end();
        }
      } catch ( error ) {
        if ( error.name === 'SequelizeValidationError' || error.name ===
          'SequelizeUniqueConstraintError' ) {
          const errors = error.errors.map( err => err.message );
          res.status( 400 ).json({errors});
        } else {
          throw error;
        }
      }
}));

// Route deletes corresponding course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const user = req.currentUser;
        const course = await Course.findByPk( req.params.id );
        if ( course === null ) {
          const error = new Error('Course does not exist.' );
          throw error.status(404);
        } else if ( course.userId === user.id ) {
          await course.destroy();
          res.status(204).end();
        } else {
          res.status(403).end();
        }
      } catch ( error ) {
        if ( error.name === 'SequelizeValidationError' || error.name ===
          'SequelizeUniqueConstraintError' ) {
          const errors = error.errors.map( err => err.message );
          res.status(400).json({errors});
        } else {
          throw error;
        }
      }
}));


module.exports = router;
