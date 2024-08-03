const car = require('../models/car');
const User = require('../models/user');

module.exports.showCars = async (req, res) => {
    const cars = await car.find({});
    res.render('user/carList.ejs', { cars });
}

module.exports.signup = (req, res) => {
    res.render('user/signup.ejs');
}

module.exports.login = (req, res) => {
    res.render('user/login.ejs');
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    }); 
}

