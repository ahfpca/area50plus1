import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NewUserComponent } from './new-user/new-user.component';
import { PlaygroundComponent } from './playground/playground.component';
import { GameOverComponent } from './game-over/game-over.component';

const config: SocketIoConfig = { url: 'http://10.0.0.44:5000', options: {} };
// const config: SocketIoConfig = { url: 'http://area50plus1.com', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NewUserComponent,
    PlaygroundComponent,
    GameOverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
