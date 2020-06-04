const express = require('express');
const router = express.Router();
const studentRouter = require('./routers/student');
const courseRouter = require('./routers/course');
const userRouter = require('./routers/user');
const authRouter = require('./routers/auth');
const authGuard = require('./middlewares/authGuard');

router.use('/students', studentRouter);
router.use('/courses', authGuard, courseRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router;
