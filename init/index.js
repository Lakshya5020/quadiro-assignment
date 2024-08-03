const mongoose = require('mongoose');
const initData = require('./data.js');
const car = require("../models/car.js");

const mongo_url = "mongodb://127.0.0.1:27017/carstore";
main()
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongo_url);
};

const connectDB = async () => {
    await car.deleteMany({});
    await car.insertMany(initData.data);
    console.log("Data was initialized");
};

connectDB();