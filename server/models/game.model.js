console.log("2-2- Model Set: Game");

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const User = require('./user.model');

const GameSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Title cannot be empty!"],
        minlength: [3, "Title must be at least 3 characters long!"],
        unique: true,
        uniqueCaseInsensitive: true
    },
    background: { 
        type: Number, 
        required: [true, "Background cannot be empty!"],
        minlength: [10, "Background must be at least 10 characters long!"]
    },
    owner_user_id: {
        type: String,
        required: [true, 'Owner cannot be empty!']
    },
    players: {
        type: [String],
        required: false
    }
}, { timestamps: true });

GameSchema.plugin(uniqueValidator, { message: '{VALUE} is already registered in database!' });

mongoose.model('Game', GameSchema);
