const car = require('../models/car');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');


module.exports.logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });

}

module.exports.login = async (req, res) => {
    let admin = new User({
        username: "admin",
        email: "admin@gmail.com",
    });
    const registeredUser = await User.findOne({ username: admin.username });
    if (!registeredUser) {
        await User.register(admin, "admin");
    }
    res.render('admin/login.ejs');
}

//-------------------- BASIC CONTROLLERS --------------------
module.exports.dashboard = async (req, res) => {
    const cars = await car.find({});
    res.render('admin/dashboard.ejs', { cars, totalCars: cars.length });
}

module.exports.showCar = async (req, res) => {
    const { id } = req.params;
    const carToShow = await car.findById(id);
    res.render('admin/show.ejs', { carToShow });
}

module.exports.newCar = async (req, res) => {
    res.render('admin/newCar.ejs');
}

module.exports.editCar = async (req, res) => {
    const { id } = req.params;
    const carToEdit = await car.findById(id);
    res.render('admin/editCar.ejs', { carToEdit });
}

module.exports.createCar = async (req, res, next) => {
    if (!req.body.car) {
        throw new ExpressError('Invalid Car Data', 400);
    }
    const newCar = new car(req.body.car);
    await newCar.save();
    res.redirect('/admin/dashboard');
}

module.exports.updateCar = async (req, res) => {
    if (!req.body.car) {
        throw new ExpressError('Invalid Car Data', 400);
    }
    const { id } = req.params;
    await car.findByIdAndUpdate(id, { ...req.body.car });
    res.redirect(`/admin/dashboard/${id}`);
}

module.exports.deleteCar = async (req, res) => {
    const { id } = req.params;
    await car.findByIdAndDelete(id);
    res.redirect('/admin/dashboard');
}