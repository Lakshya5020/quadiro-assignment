const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const car = require('../models/car');
const User = require('../models/user');
const passport = require('passport');

const userController = require('../controllers/userCon');
const user = require('../models/user');

//Signup route
router.get('/signup', userController.signup); 

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            res.redirect('/user/cars');
        });
    } catch (e) {
        res.redirect('/user/signup');
    }

}));

//Login route
router.get('/login', userController.login);

router.post('/login', passport.authenticate("local", { failureRedirect: "/user/login" }), wrapAsync(async (req, res) => {
    res.redirect('/user/cars');
}));

//Logout route
router.get('/logout', userController.logout);

//Show route
router.get('/cars', wrapAsync(userController.showCars));

module.exports = router;