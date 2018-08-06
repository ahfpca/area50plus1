console.log("4-1- Controller Set: Games");

const mongoose = require('mongoose');

const Game = mongoose.model('Game');

module.exports = {
    getAll: (req, res) => {
        Game.find({}, (err, records) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", games: records });
            }
        });
    },
    getOne: (req, res) => {
        Game.findOne({ _id: req.params.id }, (err, record) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", game: record });
            }
        });
    },
    create: (req, res) => {
        const gameObj = new Game();
        gameObj.title = req.body.title;
        gameObj.background = req.body.background;
        gameObj.owner = req.body.owner;
        gameObj.players = req.body.players;

        gameObj.save((err, record) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success", game: record });
            }
        });
    },
    update: (req, res) => {
        Game.findOne({ _id: req.params.id }, (err, game) => {
            if (err) {
                res.json({ message: "Record not found!", error: err });
            } else {
                game.title = req.body.title;
                game.background = req.body.background;
                game.owner = req.body.owner;
                game.players = req.body.players;

                game.save((err) => {
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
        Game.findOneAndDelete({ _id: req.params.id }, (err) => {
            if (err) {
                res.json({ message: "Error", error: err });
            } else {
                res.json({ message: "Success" });
            }
        });
    }
}
