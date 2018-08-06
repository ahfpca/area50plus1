console.log("4-2- Controller Set: Users");

const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
    getAll: (req, res) => {
        User.find({}, (err, records) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", users: records });
            }
        });
    },
    getByName: (req, res) => {
        User.findOne({ user_name: req.params.val }, (err, record) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", user: record });
            }
        });
    },
    getOne: (req, res) => {
        User.findOne({ _id: req.params.id }, (err, record) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", user: record });
            }
        });
    },
    create: (req, res) => {
        const userObj = new User();
        userObj.user_name = req.body.user_name;
        userObj.spaceship = req.body.spaceship;

        userObj.save((err, record) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", user: record });
            }
        });
    },
    update: (req, res) => {
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) {
                res.json({ message: "Record not found!", error: err });
            } else {
                user.user_name = req.body.user_name;
                user.spaceship = req.body.spaceship;
                user.played = req.body.played;

                user.save((err) => {
                    if (err) {
                        res.json({ message: "Error", error: err });
                    } else {
                        res.json({ message: "Success" });
                    }
                });
            }
        });
    },
    delete: (req, res) => {
        User.findOneAndDelete({ _id: req.params.id }, (err) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success" });
            }
        });
    }
}
