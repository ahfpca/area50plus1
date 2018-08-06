console.log("4-3- Controller Set: ActiveUsers");

const mongoose = require('mongoose');

const ActiveUser = mongoose.model('ActiveUser');

module.exports = {
    getAll: (req, res) => {
        ActiveUser.find({}, (err, records) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", activeUsers: records });
            }
        });
    },
    getByUserName: (req, res) => {
        ActiveUser.findOne({ user_name: req.params.val }, (err, record) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", activeUser: record });
            }
        });
    },
    getByGameTitle: (req, res) => {
        ActiveUser.find({ game_title: req.params.val }, (err, records) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", activeUsers: records });
            }
        });
    },
    create: (req, res) => {
        const activeUserObj = new User();
        activeUserObj.user_id = req.body.user_id;
        activeUserObj.user_name = req.body.user_name;
        activeUserObj.game_id = req.body.game_id;
        activeUserObj.game_title = req.body.game_title;

        activeUserObj.save((err, record) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", activeUser: record });
            }
        });
    },
    delete: (req, res) => {
        ActiveUser.findOneAndDelete({ _id: req.params.id }, (err) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success" });
            }
        });
    },
    deleteUser: (req, res) => {
        ActiveUser.findAndDelete({ user_id: req.params.id }, (err) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success" });
            }
        });
    },
    deleteGame: (req, res) => {
        ActiveUser.findAndDelete({ game_id: req.params.id }, (err) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success" });
            }
        });
    }
}
