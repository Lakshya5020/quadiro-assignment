const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const car = require('../models/car');
const User = require('../models/user');
const checkUserExists = require('../middleware');
const passport = require('passport');

const adminController = require('../controllers/adminCon');

//Login route
router.get('/login', wrapAsync(adminController.login));

router.post('/login', passport.authenticate("local", { failureRedirect: "/admin/login" }), wrapAsync(async (req, res) => {
    res.redirect('/admin/dashboard');
}));

//Logout route
router.get('/logout', wrapAsync(adminController.logout));

//Dashboard route
router.get('/dashboard', wrapAsync(adminController.dashboard));

//New route
router.get('/dashboard/new', wrapAsync(adminController.newCar));

//Show route
router.get('/dashboard/:id', wrapAsync(adminController.showCar));



//Create route
router.post('/dashboard', wrapAsync(adminController.createCar)
);

//Edit route
router.get('/dashboard/:id/edit', wrapAsync(adminController.editCar));

//Update route
router.put('/dashboard/:id', wrapAsync(adminController.updateCar));

//Delete route
router.delete('/dashboard/:id', wrapAsync(adminController.deleteCar));


module.exports = router;