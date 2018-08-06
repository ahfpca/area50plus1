console.log("2-1- Model Set: User");

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const StatisticSchema = new mongoose.Schema({
    game_name: String,
    game_record: Number,
    played_num: Number,
    your_record: Number,
    created_at: Date
});

const UserSchema = new mongoose.Schema({
    user_name: { 
        type: String, 
        required: [true, "Username cannot be empty!"],
        minlength: [3, "Username must be at least 3 characters long!"],
        maxlength: [20, "Username must be less than 20 characters long!"],
        unique: true,
        uniqueCaseInsensitive: true
    },
    spaceship: {
        type: Number,
        required: [true, "You must select an spaceship!"]
    },
    played: {
        type: [StatisticSchema],
        required: false
    } 
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: '{VALUE} is already registered in database!' });

mongoose.model('User', UserSchema);
mongoose.model('Statistic', StatisticSchema);
