import { GameOverComponent } from './game-over/game-over.component';
import { NewUserComponent } from './new-user/new-user.component';
import { PlaygroundComponent } from './playground/playground.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'areas/newuser', pathMatch: 'full' },
  { path: 'areas/newuser', component: NewUserComponent },
  { path: 'areas/gameover', component: GameOverComponent },
  { path: 'areas/:id', component: PlaygroundComponent },
  { path: '**', redirectTo: 'areas/newuser', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
