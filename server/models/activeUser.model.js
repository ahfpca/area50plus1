console.log("2-3- Model Set: ActiveUser");

const mongoose = require('mongoose');

const ActiveUserSchema = new mongoose.Schema({
    game_id: String,
    game_title: String,
    user_id: String,
    user_name: String,
    spaceship: Number
});

mongoose.model('ActiveUser', ActiveUserSchema);
