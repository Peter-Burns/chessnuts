const db = require("../models");
const passport = require('passport');

module.exports = {
    create: function (req, res) {
        db.User.register(new db.User({ username: req.body.username }), req.body.password, function (err, user) {
            console.log(err);
            if (err) {
                return res.json('error registering user');
            }

            passport.authenticate('local')(req, res, function () {
                const { username, _id } = req.user;
                res.json({ message: "Account Created", username: username, id: _id });
            });
        });
    },
    logout: function (req, res) {
        req.logout();
        req.session.destroy();
        res.json({
            message: 'You have been logged out.'
        });
    },
    login: function (req, res) {
        passport.authenticate('local')(req, res, function () {
            const { username, _id } = req.user;
            res.json({ username: username, id: _id });
        });
    },
    currentuser: function (req, res) {
        if (!req.user) {
            return res.status(401).json({
                message: 'You are not currently logged in.'
            });
        }
        res.json({username: req.user.username, id:req.user._id});
    }
};
