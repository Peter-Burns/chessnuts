const db = require("../models");

module.exports = {
    findAll: function (req, res) {
        db.Game
            .find({ $or: [ { whitePlayer: req.user.id }, { blackPlayer: req.user.id } ] })
            .sort({ _id: -1 })
            .populate('whitePlayer')
            .populate('blackPlayer')
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    create: function (req, res) {
        db.Game
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findGame: function (req, res) {
        db.Game
            .findOne({ _id: req.params.id })
            .then(game => res.json(game))
            .catch(err => res.status(422).json(err));
    },
    updateGame: function (req, res) {
        db.Game
            .findOneAndUpdate({ _id: req.params.id },{ pgn: req.body.pgn }, { new:true })
            .then(game => res.json(game))
            .catch(err => res.status(422).json(err));
    },
};
