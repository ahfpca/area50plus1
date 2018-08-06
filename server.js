const port = 5000;
const path = require('path');
const db_name = "area50plus1_db"; // Project's database name


// ============ Express ============
const express = require('express');
const app = express();


// ============ Body Parser ============
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ============ Start Server ============
const server = app.listen(port, () => {
    console.log("---> Listening on port " + port);
});


// ============ Socket ============
const io = require('socket.io')(server);


// ============ Mongoose ============
require('./server/config/mongoose.js')(db_name);


// ============ Models ============
require('./server/models/user.model');
require('./server/models/game.model');
require('./server/models/activeUser.model');


// ============ Static Routes ============
app.use(express.static( __dirname + '/public/dist/public'));


// ============ Routes ============
require('./server/config/routes')(app, path);


// ============= Socket IO ============
var gameData = [];

io.on('connection', (socket) => {
    socket.on('gameDataChanged', (data) => {
        gameData = data;
        // console.log('##### set: ', data);

        // Update every one except sender
        socket.broadcast.emit('gameDataUpdated', gameData);
    });

    socket.on('sendGameData', (data) => {
        gameData = data;
        // console.log('##### set: ', data);

        // Update every one
        io.emit('gameDataUpdated', gameData);
    });

    socket.on('getGameData', (newPlayer) => {
        // console.log('===== get: ', newPlayer);
        if (newPlayer) {
            if (gameData && gameData.length > 0) {
                var found = false;
                for (var i = 0; i < gameData.length; i++) {
                    if (gameData[i].user_id === newPlayer.user_id) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    socket.user_id = newPlayer.user_id;
                    gameData.push(newPlayer);
                }
            } else {
                socket.user_id = newPlayer.user_id;
                gameData.push(newPlayer);
            }
        }

        // Update every one
        io.emit('gameDataUpdated', gameData);
    });

    socket.on('disconnect', () => {
        if (gameData && gameData.length > 0) {
            var found = -1;
            for (var i = 0; i < gameData.length; i++) {
                if (gameData[i].user_id === socket.user_id) {
                    found = i;
                    break;
                }
            }
            if (found > -1) {
                tmp = gameData[i];
                gameData[i] = gameData[gameData.length - 1];
                gameData[gameData.length - 1] = tmp;

                gameData.pop();

                // Update every one
                io.emit('gameDataUpdated', gameData);
            }
        }
    });
});

// TODO: Add weapon shoot
// TODO: Each weapon shoot reduces 0.5% of energy.
// TODO: Each weapon hit reduces 5% of enery.
// TODO: Only 2 weapon per second can be lunched.
// TODO: Play weapon shoot sound.
// TODO: Weapons only fly for 6 seconds, then explode!
// TODO: Show the weapon explode anigif and play sound for it.
// TODO: Each friendly hit reduces the shooter 5% too.
// TODO: Each second SS regain energy by 0.5%
// TODO: Don't let SS get close to each other.
// TODO: Put guide for game play and buttons.
// TODO: Add ship picture to list of players.


//======== DONE ========
// TODO: Make the new player download gameData first, the add their data to it.
// TODO: Randomly drop players on playground, but not so close to others.
// TODO: Show friendly SS on miniMap on green, and enemies on red.
