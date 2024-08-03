if(process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const car = require('./models/car');
const path = require("path");
const methodOverride = require('method-override');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const MongoStore=require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');

// const mongo_url = 'mongodb://127.0.0.1:27017/carstore';
const dbUrl=process.env.ATLASDB_URL;

main()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const store= MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto  : {
        secret  : 'mysupersecretcode'
    }
});

store.on("error", (e)=>{
    console.log("Session Store Error", e);
});

const sessionOptions={
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Root page
app.get('/', wrapAsync(async (req, res) => {
    res.render("root.ejs");
}));

//Routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

//----------------------------Error Handling----------------------------------
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render("error.ejs", { err });
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});