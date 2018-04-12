const mongoose = require("mongoose");
// Save a reference to the Schema constructor
const Schema = mongoose.Schema;


const GameSchema = new Schema({
    pgn: {
        type: String,
        default: ""
    },
    whitePlayer: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    blackPlayer: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    joinable: {
        type:Boolean,
        default:true
    },
    gameover:{
        type:Boolean,
        default:false
    },
    result:{
        type:String,
        default:false
    },
    turn: {
        type: String,
        default:'w'
    }
});

// This creates our model from the above schema, using mongoose's model method
const Game = mongoose.model("Game", GameSchema);

// Export the Game model
module.exports = Game;
