const db = require("../models");

module.exports = {
    yourTurnGames: function (req, res) {
        db.Game
            .find({
                $or: [{ $and: [{ turn: 'b' }, { blackPlayer: req.user.id }, { result: false }] }, { $and: [{ turn: 'w' }, { whitePlayer: req.user.id }, { result: false }] }]
            })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err));
    },
    numberOfGames: function (req, res) {
        db.Game
            .find()
            .then(dbModel => res.json(dbModel.length))
            .catch(err => res.status(422).json(err));
    },
    findUserGames: function (req, res) {
        db.Game
            .find({
                $and: [{ result: false },
                { $or: [{ whitePlayer: req.user.id }, { blackPlayer: req.user.id }] }]
            })
            .sort({ _id: -1 })
            .populate('whitePlayer')
            .populate('blackPlayer')
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findPastUserGames: function (req, res) {
        db.Game
            .find({
                $and: [{ gameover: true },
                { $or: [{ whitePlayer: req.user.id }, { blackPlayer: req.user.id }] }]
            })
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
            .populate('whitePlayer')
            .populate('blackPlayer')
            .then(game => res.json(game))
            .catch(err => res.status(422).json(err));
    },
    resignGame: function (req, res) {
        db.Game
            .findOneAndUpdate({ _id: req.params.id }, { turn: req.body.turn, result: req.body.result, gameover:req.body.gameover }, { new: true })
            .then(game => res.json(game))
            .catch(err => res.status(422).json(err));
    },
    updateGame: function (req, res) {
        db.Game
            .findOneAndUpdate({ _id: req.params.id }, { pgn: req.body.pgn, turn: req.body.turn, result: req.body.result, gameover:req.body.gameover }, { new: true })
            .then(game => res.json(game))
            .catch(err => res.status(422).json(err));
    },
    joinGame: function (req, res) {
        db.Game
            .findOneAndUpdate({ _id: req.params.id }, { [req.body.color]: req.user.id, joinable: false }, { new: true })
            .then(game => res.json(game))
            .catch(err => res.status(422).json(err));
    },
    joinableGames: function (req, res) {
        db.Game
            .find({ $and: [{ joinable: true }, { $nor: [{ whitePlayer: req.user.id }, { blackPlayer: req.user.id }] }] })
            .populate('whitePlayer')
            .populate('blackPlayer')
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }
};
