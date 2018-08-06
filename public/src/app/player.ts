export class Player {
    user_id: String;
    user_name: String;
    spaceship: Number;
    energy: Number;
    posX: Number;
    posY: Number;
    direction: String;
    shotsFired: Number;
    enemyHits: Number;
    friendlyHits: Number;

    constructor(id, username, ship) {
        this.user_id = id;
        this.user_name = username;
        this.spaceship = ship;
        this.energy = 1000;
        this.posX = 0; // TODO: set x, y randomly but for init insertion change pos if it is close to an enemy
        this.posY = 0;
        this.direction = 'UP';
    }
}

/*
{
    user_id: '',
    user_name: '',
    spaceship: 0,
    energy: 0,
    posX: 0,
    posY: 0,
    direction: '',
    shotsFired: 0,
    enemyHits: 0,
    friendlyHits: 0
}
*/
