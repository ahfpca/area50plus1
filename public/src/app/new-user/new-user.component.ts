// import { ActiveUserService } from './../active-user.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
    games: any[] = [];
    userName: String = '';
    commonErrors: any;
    spaceships: String[] = [];
    selectedShip: Number = 0;

    constructor(
        private _userService: UserService,
        // private _activeUserService: ActiveUserService,
        private _router: Router
    ) { }

    ngOnInit() {
        for (let i = 1; i <= 8; i++) {
            this.spaceships.push('0' + i);
        }
    }

    isValid(): Boolean {
        let result: Boolean = true;

        if (this.userName.trim().length === 0) {
            this.commonErrors = { errors: { username: { message: 'Please enter your name!' } } };
            result = false;
        } else {
            const usernameClass = document.getElementById('username').getAttribute('class');
            if (usernameClass.indexOf('ng-invalid') >= 0) {
                this.commonErrors = { errors: { username: { message: 'Name must have at least 3 characters!' } } };
                result = false;
            }
        }

        if (this.selectedShip === 0) {
            this.commonErrors = { errors: { spaceship: { message: 'Please select a spaceship!' } } };
            result = false;
        }

        return result;
    }

    // createNewGame() {
    //   if (this.isValid()) {
    //     this._userService.getByName(this.userName).subscribe(res => {
    //       if (res['error']) {
    //         this.commonErrors = res['error'];
    //       } else {
    //         if (!res['user']) { // It's a new user

    //         } else { // User is already registered
    //           const user = res['user'];
    //           // Find user‘s record
    //           this._activeUserService.getOne(user._id).subscribe(res2 => {
    //             if (res2['error']) {
    //               this.commonErrors = res2['error'];
    //             } else {
    //               if (!res['activeUser']) { // It's not in any game

    //               } else { // It's already in a game
    //                 const activeUser = res['activeUser'];
    //                 // Ask them if they want to continue other game or create new one
    //               }
    //             }
    //           });
    //         }
    //       }
    //     });
    //   }
    // }

    joinTheGame() {
        if (this.isValid()) {
            this._userService.getByName(this.userName).subscribe(res => {
                if (res['error']) {
                    this.commonErrors = res['error'];
                } else {
                    if (!res['user']) { // It's a new user, create it
                        const user = { user_name: this.userName, spaceship: this.selectedShip };
                        // Create new user
                        this._userService.create(user).subscribe(res2 => {
                            if (res2['error']) {
                                this.commonErrors = res2['error'];
                            } else {
                                if (res2['user']) { // User record created
                                    // Redirect to playground
                                    this._router.navigate(['/areas/' + res2['user']._id]);
                                }
                            }
                        });
                    } else { // User is already registered
                        const user = res['user'];
                        if (user.spaceship !== this.selectedShip) {
                            user.spaceship = this.selectedShip;
                            this._userService.update(user).subscribe(res2 => {
                                if (res2['error']) {
                                    this.commonErrors = res2['error'];
                                } else {
                                    // Redirect to playground
                                    this._router.navigate(['/areas/' + user._id]);
                                }
                            });
                        } else {
                            // Redirect to playground
                            this._router.navigate(['/areas/' + user._id]);
                        }
                    }
                }
            });
        }
    }

    selectSpaceShip(selectedShip: String): void {
        for (let i = 1; i <= 8; i++) {
            const shipName = 'SpaceShip0' + i;

            const element = document.getElementById(shipName);
            let ssClass = element.getAttribute('class');

            if (ssClass.indexOf('selected') >= 0) {
                ssClass = ssClass.replace('selected', '');
            }

            if (shipName === selectedShip) {
                ssClass += ' selected';
                this.selectedShip = i;
            }

            element.setAttribute('class', ssClass);
        }
    }
}
