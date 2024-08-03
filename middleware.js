// middleware/checkUserExists.js
const User = require('./models/user');

const checkUserExists = async (req, res, next) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.redirect('/admin/login'); // Redirect or handle the error as needed
    }
    next();
};

module.exports = checkUserExists;