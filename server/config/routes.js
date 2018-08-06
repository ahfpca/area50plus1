console.log("3--- Routes Set");

const gamesCtrl = require('./../controllers/game.ctrl');
const usersCtrl = require('./../controllers/user.ctrl');
const activeusersCtrl = require('./../controllers/activeUser.ctrl');

module.exports = (app, path) => {

    ////////////////////////////////////////////////////////////
    ///////////////////  Game API Routes  //////////////////////
    ////////////////////////////////////////////////////////////

    // Retrieve an Game
    app.get('/api/games/:id', (req, res) => {
        gamesCtrl.getOne(req, res);
    });

    // Retrieve all Games
    app.get('/api/games', (req, res) => {
        gamesCtrl.getAll(req, res);
    });

    // Create an Game
    app.post('/api/games', (req, res) => {
        gamesCtrl.create(req, res);
    });

    // Update an Game
    app.put('/api/games/:id', (req, res) => {
        gamesCtrl.update(req, res);
    });

    // Delete an Game
    app.delete('/api/games/:id', (req, res) => {
        gamesCtrl.delete(req, res);
    });

    ////////////////////////////////////////////////////////////
    ///////////////////  User API Routes  //////////////////////
    ////////////////////////////////////////////////////////////

    // Retrieve an User
    app.get('/api/users/:id', (req, res) => {
        usersCtrl.getOne(req, res);
    });

    // Retrieve an User by Name
    app.get('/api/users/:val/name', (req, res) => {
        usersCtrl.getByName(req, res);
    });

    // Retrieve all User
    app.get('/api/users', (req, res) => {
        usersCtrl.getAll(req, res);
    });

    // Create an User
    app.post('/api/users', (req, res) => {
        usersCtrl.create(req, res);
    });

    // Update an User
    app.put('/api/users/:id', (req, res) => {
        usersCtrl.update(req, res);
    });

    // Delete an User
    app.delete('/api/users/:id', (req, res) => {
        usersCtrl.delete(req, res);
    });

    //////////////////////////////////////////////////////////////////
    ///////////////////  ActiveUser API Routes  //////////////////////
    //////////////////////////////////////////////////////////////////

    // Retrieve an ActiveUser
    app.get('/api/activeusers/:id', (req, res) => {
        activeusersCtrl.getOne(req, res);
    });

    // Retrieve an User by Name
    app.get('/api/activeusers/:val/name', (req, res) => {
        activeusersCtrl.getByName(req, res);
    });

    // Retrieve all ActiveUser
    app.get('/api/activeusers', (req, res) => {
        activeusersCtrl.getAll(req, res);
    });

    // Create an ActiveUser
    app.post('/api/activeusers', (req, res) => {
        activeusersCtrl.create(req, res);
    });

    // Delete an ActiveUser
    app.delete('/api/activeusers/:id', (req, res) => {
        activeusersCtrl.delete(req, res);
    });

    // Delete an ActiveUser by user_id
    app.delete('/api/activeusers/:id/user', (req, res) => {
        activeusersCtrl.deleteUser(req, res);
    });

    // Delete all ActiveUsers of a game
    app.delete('/api/activeusers/:id/game', (req, res) => {
        activeusersCtrl.deleteGame(req, res);
    });

    ////////////////////////////////////////////////////////////
    //////////////////  Front-end Routes  //////////////////////
    ////////////////////////////////////////////////////////////

    // Catch the front-end rounting
    app.all("*", (req, res, next) => {
        res.sendFile(path.resolve("./public/dist/public/index.html"));
    });
}
