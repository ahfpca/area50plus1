import { Playground } from '../playground';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Player } from '../player';
import { Socket } from 'ngx-socket-io';
import { interval } from 'rxjs';

@Component({
    selector: 'app-playground',
    templateUrl: './playground.component.html',
    styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
    gameData: any = []; // Holds data for all players
    lastGameData: any = [];
    playerIds: string[] = [];
    firedShots: any = [];
    lastShot: Number = 0;
    shotDelay = 1000; // Milliseconds
    weasonSpeed = 12; // Pixels in each loop
    ssSpeed = 10; // Spaceship Speed (Pixels in each loop)
    gameBreat = 20; // In milliseconds

    // InfoPanel
    heroIndex = -1; // Index of me at incoming gameData list at any moment
    shotsCount = 0;
    enemyHits = 0;
    friendlyHits = 0;

    user: any;
    users: any[] = [];
    gameErrors: any;
    player: Player;
    players: any[] = [{ name: '', energy: 0 }];
    playgrnd: Playground;
    gameBG: String;
    bigMapLeft: number;
    bigMapTop: number;
    shipLeft: number;
    shipTop: number;
    miniShipLeft: number;
    miniShipTop: number;
    miniAreaLeft: number;
    miniAreaTop: number;
    spaceship: Number;
    direction: String = 'UP';

    // Match screen width and height with #playWindow id in CSS
    screenWidth = 960;
    screenHeight = 690;
    // Match spaceship width and height with player class in CSS
    shipWidth = 50;
    shipHeight = 50;
    shipFile: string;
    // Weapon Shots
    shotWidth = 3;
    shotHeight = 10;
    expRadius = 20; // Explosion Radius
    // Game Data
    energy = 1000;
    maxIdleSeconds = 60;
    idleCounter = 0;
    weaponAudio: any;
    explosionAudio: any;



    constructor(
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _socket: Socket
    ) {
        // Match screen width and height with #playGround id in CSS
        this.playgrnd = new Playground(1, 6000, 4000);

        // Setting user on the center of the map
        // this.bigMapLeft = (this.screenWidth - this.playgrnd.width) / 2;
        // this.bigMapTop = (this.screenHeight - this.playgrnd.height) / 2;

        // Setting user on a randem place on the map
        const maxWidth = Math.floor((this.playgrnd.width - this.screenWidth * 2.3) / this.shipWidth);
        const maxHeight = Math.floor((this.playgrnd.height - this.screenHeight * 2.3) / this.shipHeight);

        this.bigMapLeft = Math.floor(Math.random() * maxWidth * this.shipWidth + this.screenWidth) * -1;
        this.bigMapTop = Math.floor(Math.random() * maxHeight * this.shipHeight + this.screenHeight) * -1;

        // console.log('maxWidth:', maxWidth, ' - maxHeight:', maxHeight);
        // console.log('bigMapLeft:', this.bigMapLeft, ' - bigMapTop:', this.bigMapTop);

        this.shipLeft = Math.abs(this.bigMapLeft) + (this.screenWidth - this.shipWidth) / 2;
        this.shipTop = Math.abs(this.bigMapTop) + (this.screenHeight - this.shipHeight) / 2;
    }

    ngOnInit() {
        this.user = { _id: '', user_name: '', spaceship: 0 };

        this.updateMaps();

        this._route.params.subscribe((params: Params) => {
            this._userService.getOne(params['id']).subscribe(res => {
                if (res['error']) {
                    this.gameErrors = res['error'];
                    // console.log(this.updateErrors['errors']['name']);
                    this._router.navigate(['/']);
                } else {
                    this.user = res['user'];
                    this.spaceship = this.user.spaceship;
                    this.shipFile = this.getShipFile(this.spaceship, 'UP');
                    // console.log(this.user);

                    // Initially add this user to gameData on the server
                    // and get gameData from server
                    this._socket.emit('getGameData', this.curPlayerData());
                }
            });
        });

        this.getGameDataFromServer();

        this.gameLoop();

        this.weaponAudio = new Audio();
        this.weaponAudio.src = '../../assets/sounds/missle_fire_2.mp3';
        this.weaponAudio.load();

        this.explosionAudio = new Audio();
        this.explosionAudio.src = '../../assets/sounds/explosion_2.mp3';
        this.explosionAudio.load();
    }

    getShipFile(ship, direct): string {
        return './../../assets/images/SS0' + ship + direct + '.png';
    }

    @HostListener('document:keydown', ['$event.key', '$event.which'])
    onKeyDown(key: string, keyCode: number) {
        // console.log('key: ' + key + ' -- keyCode:' + keyCode);

        if (keyCode === 38 && this.bigMapTop < -5) { // ArrowUp
            this.direction = 'UP';
            this.bigMapTop += this.ssSpeed;
        }
        if (keyCode === 40 && this.bigMapTop > (this.screenHeight - this.playgrnd.height + 5)) { // ArrowDown
            this.direction = 'DN';
            this.bigMapTop -= this.ssSpeed;
        }
        if (keyCode === 37 && this.bigMapLeft < -5) { // ArrowLeft
            this.direction = 'LF';
            this.bigMapLeft += this.ssSpeed;
        }
        if (keyCode === 39 && this.bigMapLeft > (this.screenWidth - this.playgrnd.width + 5)) { // ArrowRight
            this.direction = 'RT';
            this.bigMapLeft -= this.ssSpeed;
        }

        if (keyCode === 18 || keyCode === 32) { // Alt or space
            this.shootWeapon();
        }

        if (this.direction.length && this.direction.length > 0) {
            this.shipFile = this.getShipFile(this.spaceship, this.direction);
            this.updateMaps();
        }

        this.sendGameDataToServer();

        return true;
    }

    updateMaps() {
        // Update bigMap
        const playGround = document.getElementById('playGround');
        if (playGround) {
            playGround.style.left = (this.bigMapLeft) + 'px';
            playGround.style.top = (this.bigMapTop) + 'px';
        }

        this.shipLeft = Math.abs(this.bigMapLeft) + (this.screenWidth - this.shipWidth) / 2;
        this.shipTop = Math.abs(this.bigMapTop) + (this.screenHeight - this.shipHeight) / 2;
        // console.log('debug -> ', this.shipLeft, this.shipTop);
        const hero = document.getElementById('hero');
        if (hero) {
            hero.style.left = (this.shipLeft) + 'px';
            hero.style.top = (this.shipTop) + 'px';
            hero.setAttribute('src', this.shipFile);
        }


        // Update miniMap
        this.miniAreaLeft = Math.abs(this.bigMapLeft) / 20;
        this.miniAreaTop = Math.abs(this.bigMapTop) / 20;

        const miniArea = document.getElementById('miniArea');
        if (miniArea) {
            miniArea.style.left = (this.miniAreaLeft) + 'px';
            miniArea.style.top = (this.miniAreaTop) + 'px';
        }

        const miniHero = document.getElementById('miniHeroSS');
        if (miniHero) {
            miniHero.setAttribute('src', this.shipFile);
        }
    }

    curPlayerData() {
        return {
            user_id: this.user._id,
            user_name: this.user.user_name,
            spaceship: this.spaceship,
            energy: this.energy,
            posX: this.shipLeft,
            posY: this.shipTop,
            direction: this.direction,
            shotsCount: this.shotsCount,
            enemyHits: this.enemyHits,
            friendlyHits: this.friendlyHits,
            firedShots: this.firedShots
        };
    }

    sendGameDataToServer() {
        const myGameData = this.curPlayerData();

        // console.log('len:', this.gameData.length);
        // console.log('myData:', myGameData);

        let found = false;
        for (let i = 0; i < this.gameData.length; i++) {
            if (this.gameData[i].user_id === this.user._id) {
                this.gameData[i] = myGameData;
                found = true;
            }
        }

        if (!found) {
            // console.log('Debug - Data Pushed Client Side');
            this.gameData.push(myGameData);
        }

        this._socket.emit('gameDataChanged', this.gameData);
        this.idleCounter = 0;
    }

    getGameDataFromServer() {
        this._socket.fromEvent('gameDataUpdated').subscribe((data) => {
            if (data) {
                this.gameData = data;
                // console.log('debug - recieve:', data);

                this.idleCounter = 0;

                // Sort the data
                this.gameData.sort((a, b) => {
                    const textA = a.user_name.toUpperCase();
                    const textB = b.user_name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
            }
        });
    }

    RemoveArrayItem(arr, i) {
        if (arr && arr.length > 0) {
            const temp = arr[i];
            arr[i] = arr[arr.length - 1];
            arr[length - 1] = temp;

            arr.pop();
        }

        return arr;
    }

    gameLoop() {
        const subscription = interval(this.gameBreat).subscribe(() => {
            // console.log('debug loop');
            this.idleCounter++;

            if (this.idleCounter >= this.maxIdleSeconds) {
                // subscription.unsubscribe();
                // this._router.navigate(['/']);
            }

            // Draw Spaceships
            if (this.gameData && this.gameData !== this.lastGameData) {
                this.lastGameData = this.gameData;

                let bigMap = document.getElementById('playGround').innerHTML;
                let miniMap = document.getElementById('miniMap').innerHTML;
                let changed = false;
                let miniChanged = false;

                this.players = [];
                for (let i = 0; i < this.gameData.length; i++) {
                    this.players.push({ name: this.gameData[i].user_name, energy: (this.gameData[i].energy / 10) });

                    // Draw other players
                    const theId = this.gameData[i].user_id;

                    // If it is my data, update properties and save index for shooting process
                    if (theId === this.user._id) {
                        this.heroIndex = i;
                    }

                    if (theId && theId !== this.user._id) {
                        // console.log('game data:', this.gameData);

                        // Check the player in bigMap
                        const elmnt = document.getElementById(theId);
                        if (!elmnt) {
                            // Add to bigMap
                            bigMap += '<img id="' + theId + '" class="player" ' +
                                'src="' + this.getShipFile(this.gameData[i].spaceship, this.gameData[i].direction) + '"' +
                                ' style="position: absolute; width: ' + this.shipWidth + 'px; height: ' + this.shipHeight + 'px; left:' +
                                (this.gameData[i].posX) + 'px; top:' +
                                (this.gameData[i].posY) + 'px"></img>';

                            // Set flag for replace element's content
                            changed = true;

                            // Add player id to list of players
                            this.playerIds.push(theId);
                        } else {
                            // Update ship direction and position on bigMap
                            elmnt.setAttribute('src', this.getShipFile(this.gameData[i].spaceship, this.gameData[i].direction));
                            elmnt.style.left = (this.gameData[i].posX) + 'px';
                            elmnt.style.top = (this.gameData[i].posY) + 'px';
                        }

                        // Separate friendly and emeny ships
                        let miniColor = 'red';
                        if (this.gameData[i].spaceship === this.spaceship) {
                            miniColor = 'lightgreen';
                        }

                        // Update the other players in miniMap
                        const miniElmnt = document.getElementById('mini_' + theId);
                        if (!miniElmnt) {
                            // Add to miniMap
                            miniMap += '<img id="' + 'mini_' + theId + '" ' +
                            'src="' + this.getShipFile(this.gameData[i].spaceship, this.gameData[i].direction) + '"' +
                            ' style="position: absolute; width: 8px; height: 8px; border: 2px ' + miniColor + ' solid; left:' +
                            (this.gameData[i].posX / 20) + 'px; top:' +
                            (this.gameData[i].posY / 20) + 'px"></img>';

                            // Set flag for replace element's content
                            miniChanged = true;
                        } else {
                            // Update ship direction and position on miniMap
                            miniElmnt.setAttribute('src', this.getShipFile(this.gameData[i].spaceship, this.gameData[i].direction));
                            miniElmnt.style.borderColor = miniColor;
                            miniElmnt.style.left = (this.gameData[i].posX / 20) + 'px';
                            miniElmnt.style.top = (this.gameData[i].posY) / 20 + 'px';
                        }

                        if (this.gameData[i].firedShots && this.gameData[i].firedShots.length > 0) {
                            // console.log('enemy shots:', this.gameData[i].firedShots);
                            this.firedShots = this.firedShots.concat(this.gameData[i].firedShots);
                        }
                    }
                }

                // Check if a playerId is not in the gameData, remove it from the screen
                if (this.playerIds) {
                    for (let j = 0; j < this.playerIds.length; j++) {
                        let found = false;
                        for (let i = 0; i < this.gameData.length; i++) {
                            // If a player is eliminated remove it from gameData
                            if (this.gameData[i].energy <= 0) {
                                this.RemoveArrayItem(this.gameData, i);
                                break;
                            }

                            if (this.gameData[i].user_id === this.playerIds[j] && this.gameData[i].energy > 0) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            // Remove it from bigMap
                            const item = document.getElementById(this.playerIds[j]);
                            if (item) {
                                item.parentNode.removeChild(item);
                            }

                            // Remove it from miniMap
                            const miniItem = document.getElementById('mini_' + this.playerIds[j]);
                            if (miniItem) {
                                miniItem.parentNode.removeChild(miniItem);
                            }

                            this.RemoveArrayItem(this.playerIds, j);
                        }
                    }
                }

                if (changed) {
                    document.getElementById('playGround').innerHTML = bigMap;
                }

                if (miniChanged) {
                    document.getElementById('miniMap').innerHTML = miniMap;
                }
                // console.log(miniMap);
            }

            this.DrawShots(this.firedShots);
        });
    }

    DrawShots(arr) {
        // Draw shots
        if (arr && arr.length > 0) {
            let changed = false;
            let shotHit = false;
            let bigMap = document.getElementById('playGround').innerHTML;

            // Remove exploded shots from playground
            // for (let i = 0; i < arr.length; i++) {
            //     const elmnt = document.getElementById(arr[i].shotId); // Get the shot element on the bigMap
            //     if (elmnt && arr[i].fuel <= 0) {
            //         this.RemoveArrayItem(arr, i);
            //         elmnt.parentNode.removeChild(elmnt);
            //     }
            // }

            // Loop through live shots
            for (let i = 0; i < arr.length; i++) {
                const elmnt = document.getElementById(arr[i].shotId); // Get the shot element on the bigMap
                if (!elmnt) {
                    if (arr[i].fuel > 0) {
                        // Add to bigMap
                        bigMap += '<div id="' +
                            arr[i].shotId + '" style="position: absolute; background-color: magenta; width: ' +
                            arr[i].width + 'px; height: ' +
                            arr[i].height + 'px; left:' +
                            arr[i].posX + 'px; top:' +
                            arr[i].posY + 'px"></div>';

                        // Set flag for replace element's content
                        changed = true;
                    }
                } else {
                    // Update the shot position

                    if (arr[i].fuel <= 0) { // If it's out of fuel remove it
                        this.RemoveArrayItem(arr, i);
                        elmnt.parentNode.removeChild(elmnt);
                    } else {
                        // Update shot‘s position on bigMap
                        let posX = arr[i].posX;
                        let posY = arr[i].posY;
                        let expoX = posX;
                        let expoY = posY;


                        switch (arr[i].direction) {
                            case 'UP':
                                posY -= this.weasonSpeed;
                                expoY = posY - this.weasonSpeed;
                                expoX -= this.expRadius / 2;
                                break;
                            case 'DN':
                                posY += this.weasonSpeed;
                                expoY = posY + this.weasonSpeed;
                                expoX -= this.expRadius / 2;
                                break;
                            case 'LF':
                                posX -= this.weasonSpeed;
                                expoX = posX - this.weasonSpeed;
                                expoY -= this.expRadius / 2;
                                break;
                            case 'RT':
                                posX += this.weasonSpeed;
                                expoX = posX + this.weasonSpeed;
                                expoY -= this.expRadius / 2;
                                break;
                        }

                        arr[i].posX = posX;
                        arr[i].posY = posY;
                        arr[i].fuel--;

                        elmnt.style.left = (posX) + 'px';
                        elmnt.style.top = (posY) + 'px';

                        // Check for collision
                        for (let s = 0; s < this.gameData.length; s++) {
                            if (this.isCollided(this.gameData[s].posY, this.gameData[s].posX,
                                                this.gameData[s].posY + this.shipHeight, this.gameData[s].posX + this.shipWidth,
                                                arr[i].posY, arr[i].posX,
                                                arr[i].posY + this.shotHeight, arr[i].posX + this.shotWidth)) {
                                // Make Explosion Effect
                                elmnt.style.left = expoX;
                                elmnt.style.top = expoY;
                                elmnt.style.backgroundColor = 'yellow';
                                elmnt.style.width = this.expRadius + 'px';
                                elmnt.style.height = this.expRadius + 'px';
                                elmnt.style.border = '0px black solid';
                                elmnt.style.borderRadius = (this.expRadius / 2) + 'px';
                                // Eliminate the shot
                                arr[i].fuel = 0;
                                // Play the explosion sound
                                this.explosionAudio.play();
                                // Update Players Energies
                                if (this.heroIndex >= 0) { // If index of me is located in the gameData list
                                    // If shooter is me
                                    if (arr[i].shooterId === this.user._id) {
                                        if (this.spaceship === this.gameData[s].spaceship) {
                                            this.gameData[this.heroIndex].friendlyHits++;
                                            this.gameData[s].energy -= 50;
                                            this.gameData[this.heroIndex].energy -= 50;
                                        } else {
                                            this.gameData[this.heroIndex].enemyHits++;
                                            this.gameData[s].energy -= 50;
                                        }

                                        // Update my statistics
                                        this.energy = this.gameData[this.heroIndex].energy;
                                        this.friendlyHits = this.gameData[this.heroIndex].friendlyHits;
                                        this.enemyHits = this.gameData[this.heroIndex].enemyHits;

                                        shotHit = true;
                                    }

                                    // Check for elimination
                                    if (this.gameData[s].energy <= 0 && this.gameData[s].user_id === this.user._id) {
                                        this.gameData[s].energy = 0;
                                        shotHit = false;
                                        this._router.navigate(['/areas/gameover']);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (shotHit) {
                // this._socket.emit('gameDataChanged', this.gameData);
                this._socket.emit('sendGameData', this.gameData);
                this.idleCounter = 0;
            }

            if (changed) {
                document.getElementById('playGround').innerHTML = bigMap;
            }
        }
    }

    shootWeapon() {
        const curMSec = (new Date).getTime();
        if (curMSec >= this.lastShot) {
            this.weaponAudio.play();
            this.shotsCount++;

            this.lastShot = curMSec + this.shotDelay;

            let posX = this.shipLeft + (this.shipWidth / 2); // case 'UP'
            let posY = this.shipTop - this.shotHeight;
            let width = this.shotWidth;
            let height = this.shotHeight;
            switch (this.direction) {
                case 'DN':
                    posX = this.shipLeft + (this.shipWidth / 2);
                    posY = this.shipTop + this.shipHeight;
                    width = this.shotWidth;
                    height = this.shotHeight;
                    break;
                case 'LF':
                    posX = this.shipLeft - this.shotHeight;
                    posY = this.shipTop + (this.shipHeight / 2);
                    width = this.shotHeight;
                    height = this.shotWidth;
                    break;
                case 'RT':
                    posX = this.shipLeft + this.shipWidth;
                    posY = this.shipTop + (this.shipHeight / 2);
                    width = this.shotHeight;
                    height = this.shotWidth;
                    break;
            }

            const shot = {
                shotId: this.user._id + '_' + curMSec,
                shotAt: curMSec,
                posX: posX,
                posY: posY,
                width: width,
                height: height,
                direction: this.direction,
                shooterId: this.user._id,
                shooterSS: this.spaceship,
                hitId: '',
                hitSS: 0,
                fuel: 35
            };

            this.firedShots.push(shot);
        }
    }

    isCollided(t1, l1, b1, r1, t2, l2, b2, r2) {
        if (((t1 >= t2 && t1 <= b2) || (t2 >= t1 && t2 <= b1)) &&
            ((l1 >= l2 && l1 <= r2) || (l2 >= l1 && l2 <= r1))) {
            return true;
        }

        return false;
    }

}
